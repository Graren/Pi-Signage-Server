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
from srv.resources import UsuarioResource, ListaResource, ArchivoResource, Grupo_DispositivoResource, DispositivoResource
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

user_resource = UsuarioResource()
list_resource = ListaResource()
file_resource = ArchivoResource()
device_group_resource = Grupo_DispositivoResource()
device_resource = DispositivoResource()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('srv.urls')),
    url(r'^srv/', include(user_resource.urls)),
    url(r'^srv/', include(list_resource.urls)),
    url(r'^srv/', include(file_resource.urls)),
    url(r'^srv/', include(device_group_resource.urls)),
    url(r'^srv/', include(device_resource.urls)),
    url(r'^api/$', get_schema_view()),
    url(r'^api/auth/', include(
        'rest_framework.urls', namespace='rest_framework')),
    url(r'^api/auth/token/obtain/$', TokenObtainPairView.as_view()),
    url(r'^api/auth/token/refresh/$', TokenRefreshView.as_view()),

]
