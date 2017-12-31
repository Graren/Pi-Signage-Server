"""digital_pignage URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from tastypie.api import Api
from srv.resources import UsuarioResource, ListaResource, ArchivoResource, GrupoDispositivoResource, DispositivoResource

class CustomApi(Api):
    def prepend_urls(self):
        return [
            url(r'^v1/mipapo', include('srv.urls')),
        ]

v1_api = CustomApi(api_name='v1')
v1_api.register(UsuarioResource())
v1_api.register(ListaResource())
v1_api.register(ArchivoResource())
v1_api.register(GrupoDispositivoResource())
v1_api.register(DispositivoResource())

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('srv.urls')),
    url(r'^api/', include(v1_api.urls)),
]

