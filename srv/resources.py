from tastypie.resources import ModelResource,ALL, ALL_WITH_RELATIONS
from tastypie import fields
from django.db import IntegrityError
from django.forms.models import model_to_dict
import jwt
from srv.authentication.JwtAuthentication import JwtAuthentication, CreateWithoutAuthentication
from srv.authorization.UsersAuthorization import UsersAuthorization
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
        excludes = ['password', 'is_superuser']
        filtering = {
            'nombre': ['exact', ],
        }

    @property
    def ignore_post_fields(self):
        return ['activo', 'is_superuser', 'id', 'last_login']

    def obj_create(self, bundle, request=None, **kwargs):
        try:
            for field in self.ignore_post_fields:
                bundle.data.pop(field, None)

            bundle = super(UsuarioResource, self).obj_create(bundle, **kwargs)
            bundle.obj.set_password(bundle.data.get('password'))
            bundle.obj.save()
        except IntegrityError as e:
            raise BadRequest('Este correo ya existe')

        return bundle

    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('login'), name="api_login")
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


class ListaResource(ModelResource):
    class Meta:
        queryset = Lista.objects.all()
        resource_name = 'list'

class ArchivoResource(ModelResource):
    user = fields.ForeignKey(UsuarioResource, 'user',full=True)
    list = fields.ForeignKey(ListaResource, 'lista',full=True)
    class Meta:
        queryset = Archivo.objects.all()
        resource_name = 'file'
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'list': ALL_WITH_RELATIONS,
            'nombre': ['exact',],
        }

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