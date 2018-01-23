from tastypie.resources import ModelResource,ALL, ALL_WITH_RELATIONS
from tastypie import fields
from django.db import IntegrityError
from django.forms.models import model_to_dict
import jwt
import json
from srv.authentication.JwtAuthentication import JwtAuthentication, CreateWithoutAuthentication
from srv.authorization.UsersAuthorization import UsersAuthorization
from srv.authorization.UserObjectsOnlyAuthorization import UserObjectsOnlyAuthorization
from tastypie.authorization import Authorization
from django.conf.urls import url
from django.conf import settings
from django.http import HttpResponse
from tastypie.utils import trailing_slash
from tastypie.http import HttpUnauthorized, HttpForbidden, HttpBadRequest
from tastypie.exceptions import BadRequest
from srv.models import Usuario, Dispositivo, GrupoDispositivos, Lista, Archivo
from srv.utils import send_ws_message_to_pi_groups, send_ws_message_to_pi_device
from srv.actions import Actions

class UsuarioResource(ModelResource):
    class Meta:
        queryset = Usuario.objects.all()
        resource_name = 'user'
        authentication = CreateWithoutAuthentication()
        authorization = UsersAuthorization()
        always_return_data = True
        excludes = ['activo', 'groups', 'is_superuser', 'last_login', 'password', 'user_permissions']
        filtering = {
            'nombre': ['exact', ],
        }

    def dehydrate(self, bundle):
        include_token = bundle.data.get('include_token', False)
        bundle.data.pop('password', None)

        if include_token:
            bundle.data.pop('include_token')
            bundle.data['token'] = bundle.obj.token

        return bundle

    @property
    def ignore_post_fields(self):
        return ['activo', 'is_superuser', 'id', 'last_login']

    def obj_create(self, bundle, request=None, **kwargs):
        try:
            for field in self.ignore_post_fields:
                bundle.data.pop(field, None)

            email = bundle.data.get('email', '')
            password = bundle.data.get('password', '')
            if len(email) == 0:
                raise BadRequest('Correo Inválido')
            if len(password) == 0:
                raise BadRequest('Contraseña Inválida')

            bundle = super(UsuarioResource, self).obj_create(bundle, **kwargs)
            bundle.obj.set_password(bundle.data.get('password'))
            bundle.obj.save()
        except IntegrityError as e:
            raise BadRequest('Este correo ya existe')

        bundle.data['include_token'] = True
        return bundle

    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('login'), name="api_login"),
            url(r"^(?P<resource_name>%s)/me%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('me'), name="me"),
            url(r"^(?P<resource_name>%s)/stats%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('stats'), name="stats")
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body,
                                format=request.META.get('CONTENT_TYPE', 'application/json'))

        email = data.get('email', '')
        password = data.get('password', '')

        try:
            user = Usuario.objects.get(email=email)
            if not user.check_password(password):
                raise ValueError('Contrasena erronea')
            if user.activo:
                return self.create_response(request, {
                    'success': True,
                    'token': user.token
                })
            else:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'disabled',
                }, HttpForbidden)
        except Exception as e:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
            }, HttpUnauthorized)

    def me(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        try:
            user = model_to_dict(request.user)
            remove_fields = ['activo', 'groups', 'is_superuser',
                             'last_login', 'password', 'user_permissions']
            for field in remove_fields:
                user.pop(field, None)

            return self.create_response(request, user)
        except Exception as e:
            return self.create_response(request, {
                'success': False,
                'reason': 'Hubo un error al obtener la informacion de tu usuario',
            }, HttpBadRequest)

    def stats(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        try:
            screens_count = Dispositivo.objects.filter(grupo__user=request.user).count()
            groups_count = GrupoDispositivos.objects.filter(user=request.user).count()
            playlists_count = Lista.objects.filter(user=request.user).count()

            return self.create_response(request, {
                'screens': screens_count,
                'groups': groups_count,
                'playlists': playlists_count,
            })
        except Exception as e:
            return self.create_response(request, {
                'success': False,
                'reason': 'Hubo un error al obtener las estadisticas de tu usuario',
            }, HttpBadRequest)


class ListaResource(ModelResource):
    user = fields.ForeignKey(UsuarioResource, 'user')

    class Meta:
        queryset = Lista.objects.all()
        resource_name = 'list'
        always_return_data = True
        authentication = JwtAuthentication()
        authorization = UserObjectsOnlyAuthorization()

    def obj_create(self, bundle, request=None, **kwargs):
        if bundle.request.user.is_superuser:
            bundle.data.setdefault('user', bundle.request.user)
        else:
            bundle.data['user'] = bundle.request.user

        bundle = super(ListaResource, self).obj_create(bundle, **kwargs)
        bundle.obj.save()
        return bundle

    def obj_delete(self, bundle, **kwargs):
        groups = GrupoDispositivos.objects.filter(lista=kwargs['pk'])
        msg = Actions.delete_playlist()
        send_ws_message_to_pi_groups(groups, msg)

        return super(ListaResource, self).obj_delete(bundle, **kwargs)

class ArchivoResource(ModelResource):
    list = fields.ForeignKey(ListaResource, 'lista',full=True)

    class Meta:
        queryset = Archivo.objects.all()
        resource_name = 'file'
        authentication = JwtAuthentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'list': ALL_WITH_RELATIONS,
            'nombre': ['exact',],
        }

    def obj_create(self, bundle, request=None, **kwargs):
        try:
            bundle.data['list'] = Lista.objects.get(pk=bundle.data['listId'])
        except Exception:
            return self.create_response(request, {
                'success': False,
                'reason': 'Lista invalida',
            }, HttpBadRequest)

        if not bundle.data.get('tipo', 'tipo') == 'mp4':
            bundle.data['tiempo'] = 10
            fit = bundle.data.pop('ajuste', None)
            if fit in ['cover', 'contain']:
                bundle.data['ajuste'] = fit
        else:
            fit = bundle.data.pop('ajuste', None)
            if fit in ['cover', 'contain', 'fill']:
                bundle.data['ajuste'] = fit

        bundle = super(ArchivoResource, self).obj_create(bundle, **kwargs)
        bundle.obj.save()
        groups = GrupoDispositivos.objects.filter(lista=bundle.data['list'])
        msg = Actions.add_file(bundle.obj)
        send_ws_message_to_pi_groups(groups, msg)

        return bundle

    def obj_update(self, bundle, **kwargs):
        file = Archivo.objects.get(pk=kwargs['pk'])
        groups = GrupoDispositivos.objects.filter(lista=file.lista)
        for key, value in bundle.data.items():
            setattr(file, key, value)

        msg = Actions.update_file(file)
        send_ws_message_to_pi_groups(groups, msg)
        return super(ArchivoResource, self).obj_update(bundle, **kwargs)

    def obj_delete(self, bundle, **kwargs):
        file = Archivo.objects.get(pk=kwargs['pk'])
        groups = GrupoDispositivos.objects.filter(lista=file.lista)
        msg = Actions.delete_file(file.id)
        send_ws_message_to_pi_groups(groups, msg)

        return super(ArchivoResource, self).obj_delete(bundle, **kwargs)


class GrupoDispositivoResource(ModelResource):
    user = fields.ForeignKey(UsuarioResource, 'user')
    list = fields.ForeignKey(ListaResource, 'lista', full=True, null=True)

    class Meta:
        queryset = GrupoDispositivos.objects.all()
        resource_name = 'deviceGroup'
        authentication = JwtAuthentication()
        authorization = UserObjectsOnlyAuthorization()
        always_return_data = True

    def obj_create(self, bundle, request=None, **kwargs):
        if bundle.request.user.is_superuser:
            bundle.data.setdefault('user', bundle.request.user)
        else:
            bundle.data['user'] = bundle.request.user

        bundle = super(GrupoDispositivoResource, self).obj_create(bundle, **kwargs)
        bundle.obj.save()
        return bundle

    def obj_update(self, bundle, **kwargs):
        new_list_id = bundle.data.get('lista', None)

        if new_list_id:
            group = GrupoDispositivos.objects.get(pk=kwargs['pk'])
            try:
                playlist = Lista.objects.get(pk=new_list_id)
            except Lista.DoesNotExist:
                raise BadRequest('La nueva lista no existe')

            if group.lista_id != new_list_id:
                bundle.data['list'] = playlist
                playlist_files = Archivo.objects.filter(lista=playlist)
                msg = Actions.change_playlist(playlist_files)
                send_ws_message_to_pi_groups([group], msg)

        return super(GrupoDispositivoResource, self).obj_update(bundle, **kwargs)


class DispositivoResource(ModelResource):
    grupo = fields.ForeignKey(GrupoDispositivoResource, 'grupo', full=True, null=True)

    class Meta:
        queryset = Dispositivo.objects.all()
        resource_name = 'dispositivo'
        authentication = JwtAuthentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'nombre': ['exact', ],
            'grupo': ['exact', 'isnull'],
        }

    def dehydrate(self, bundle):
        bundle.data['token'] = bundle.obj.token
        return bundle

    @property
    def ignore_post_fields(self):
        return ['activo']

    def obj_create(self, bundle, request=None, **kwargs):
        try:
            for field in self.ignore_post_fields:
                bundle.data.pop(field, None)

            bundle.data.setdefault('grupo', bundle.request.user.grupo_defecto.grupo)
            bundle = super(DispositivoResource, self).obj_create(bundle, **kwargs)
            bundle.obj.save()
        except Exception as e:
            raise BadRequest('Hubo un error')

        return bundle


    def obj_update(self, bundle, **kwargs):
        try:
            new_group = bundle.data['grupo']
            device = Dispositivo.objects.get(pk=kwargs['pk'])
            playlist_files = []

            if new_group:
                new_group_id = new_group.get('pk', None)

                if new_group_id:
                    try:
                        group = GrupoDispositivos.objects.get(pk=new_group_id)
                    except GrupoDispositivos.DoesNotExist:
                        raise BadRequest('El nuevo grupo no existe')

                    if device.grupo_id != new_group_id:
                        playlist_files = Archivo.objects.filter(lista_id=group.lista_id)
                else:
                    new_group_id = 0
            else:
                new_group_id = 0

            msg = Actions.change_device_group(int(new_group_id), playlist_files)
            send_ws_message_to_pi_device(device, msg)
        except KeyError:
            pass

        return super(DispositivoResource, self).obj_update(bundle, **kwargs)


    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/activar%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('activar'), name="activar"),
            url(r"^(?P<resource_name>%s)/info%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('info'), name="info")
        ]

    def activar(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body,
                                format=request.META.get('CONTENT_TYPE', 'application/json'))

        token = data.get('token', '')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            dispositivo = Dispositivo.objects.get(pk=payload['dispositivo'])
            dispositivo.activo = True
            dispositivo.save()
            return self.create_response(request, {
                'success': True,
            })
        except Exception as e:
            return self.create_response(request, {
                'success': False,
                'reason': 'Hubo un error al activar esta pantalla',
            }, HttpBadRequest)

    def info(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        auth_type = 'bearer'
        authorization = request.META.get('HTTP_AUTHORIZATION', '')
        try:
            try:
                request_auth_type, token = authorization.split(' ', 1)
            except:
                raise ValueError('Authorization debe tener un espacio separando auth_type y data.')

            if request_auth_type.lower() != auth_type:
                raise ValueError('auth_type no es "%s".' % self.auth_type)

            payload = jwt.decode(token, settings.SECRET_KEY)

            dispositivo = Dispositivo.objects.get(pk=payload['dispositivo'])
            return self.create_response(request, model_to_dict(dispositivo))
        except Exception as e:
            return self.create_response(request, {
                'success': False,
                'reason': 'Hubo un error al obtener la informacion de esta pantalla',
            }, HttpBadRequest)