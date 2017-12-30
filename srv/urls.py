from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^view$', views.ws, name='ws'),
    url(r'^sex$', views.wsTest, name="sex"),
    # url(r'^sex2$', views.WsTestView.as_view(), name="sex2"),
    url(r'^api/echo/$', views.EchoView.as_view())
]