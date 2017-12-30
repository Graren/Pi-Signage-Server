from tastypie.resources import ModelResource,ALL, ALL_WITH_RELATIONS
from tastypie import  fields
from django.db import IntegrityError

from srv.authentication.JwtAuthentication import JwtAuthentication
from srv.authorization.UsersAuthorization import UsersAuthorization
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.authentication import Authentication
from django.conf.urls import url
from django.contrib.auth import authenticate, login
from tastypie.utils import trailing_slash
from tastypie.http import HttpUnauthorized, HttpForbidden
from tastypie.exceptions import BadRequest
from srv.models import Usuario, Dispositivo, Grupo_Dispositivos, Lista, Archivo

class UsuarioResource(ModelResource):
    class Meta:
        queryset = Usuario.objects.all()
        resource_name = 'user'
        authentication = Authentication()
        authorization = UsersAuthorization()
        excludes = ['password', 'is_superuser']
        filtering = {
            'nombre': ['exact', ],
        }

    @property
    def ignore_post_fields(self):
        return ['esta_activo', 'is_superuser', 'id', 'last_login']

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

        user = authenticate(email=email, password=password)
        if user:
            if user.is_active:
                login(request, user)
                return self.create_response(request, {
                    'success': True
                })
            else:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'disabled',
                }, HttpForbidden)
        else:
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

class Grupo_DispositivoResource(ModelResource):
    user = fields.ForeignKey(UsuarioResource, 'user', full=True)
    list = fields.ForeignKey(ListaResource, 'lista', full=True)
    class Meta:
        queryset = Grupo_Dispositivos.objects.all()
        resource_name = 'deviceGroup'
        authorization = Authorization()

class DispositivoResource(ModelResource):
    group = fields.ForeignKey(Grupo_DispositivoResource, 'grupo', full=True)
    class Meta:
        queryset = Dispositivo.objects.all()
        resource_name = 'device'
        authorization = Authorization()
        filtering = {
            'nombre': ['exact', ],
        }