from tastypie.resources import ModelResource,ALL, ALL_WITH_RELATIONS
from tastypie import fields
from django.db import IntegrityError
from django.forms.models import model_to_dict
import jwt
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
                self.wrap_view('me'), name="me")
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

class ArchivoResource(ModelResource):
    list = fields.ForeignKey(ListaResource, 'lista',full=True)

    class Meta:
        queryset = Archivo.objects.all()
        resource_name = 'file'
        authorization = Authorization()
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

        bundle = super(ArchivoResource, self).obj_create(bundle, **kwargs)
        bundle.obj.save()
        return bundle


class GrupoDispositivoResource(ModelResource):
    user = fields.ForeignKey(UsuarioResource, 'user', full=True)
    list = fields.ForeignKey(ListaResource, 'lista', full=True)
    class Meta:
        queryset = GrupoDispositivos.objects.all()
        resource_name = 'deviceGroup'
        authorization = Authorization()

class DispositivoResource(ModelResource):
    grupo = fields.ForeignKey(GrupoDispositivoResource, 'grupo', full=True)
    class Meta:
        queryset = Dispositivo.objects.all()
        resource_name = 'dispositivo'
        authentication = JwtAuthentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'nombre': ['exact', ],
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