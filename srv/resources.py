from tastypie.resources import ModelResource
from tastypie import  fields
from tastypie.authorization import Authorization
from srv.models import Usuario, Dispositivo, Grupo_Dispositivos, Lista, Archivo

class UsuarioResource(ModelResource):
    class Meta:
        queryset = Usuario.objects.all()
        resource_name = 'user'
        authorization = Authorization()
        
class DispositivoResource(ModelResource):
    class Meta:
        queryset = Dispositivo.objects.all()
        resource_name = 'device'
        authorization = Authorization()

class ListaResource(ModelResource):
    class Meta:
        queryset = Lista.objects.all()
        resource_name = 'list'
        authorization = Authorization()

class ArchivoResource(ModelResource):
    user = fields.ForeignKey(UsuarioResource, 'user')
    list = fields.ForeignKey(ListaResource, 'lista')
    class Meta:
        queryset = Archivo.objects.all()
        resource_name = 'file'
        authorization = Authorization()

class Grupo_DispositivoResource(ModelResource):
    class Meta:
        queryset = Grupo_Dispositivos.objects.all()
        resource_name = 'deviceGroup'
        authorization = Authorization()
