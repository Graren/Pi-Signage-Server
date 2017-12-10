from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^sex$', views.wsTest, name="sex"),
    url(r'^api/echo/$', views.EchoView.as_view())
]