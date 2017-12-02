from tastypie.resources import ModelResource,ALL, ALL_WITH_RELATIONS
from tastypie import  fields
from tastypie.authorization import Authorization

from srv.models import Usuario, Dispositivo, Grupo_Dispositivos, Lista, Archivo

class UsuarioResource(ModelResource):
    class Meta:
        queryset = Usuario.objects.all()
        resource_name = 'user'
        authorization = Authorization()
        filtering = {
            'nombre': ['exact', ],
        }

class ListaResource(ModelResource):
    class Meta:
        queryset = Lista.objects.all()
        resource_name = 'list'
        authorization = Authorization()

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