from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^view$', views.ws, name='ws'),
    url(r'^s3/sign$', views.sign_s3_upload, name='index'),
    url(r'^sex$', views.wsTest, name="sex"),
    url(r'^request$', views.requestTest, name="test"),
    # url(r'^sex2$', views.WsTestView.as_view(), name="sex2"),
    url(r'^api/echo/$', views.EchoView.as_view())
]