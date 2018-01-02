from django.http import HttpResponse
from django.shortcuts import render
from srv.testWS.wsGroups import GroupWsHolder
from rest_framework import views, serializers, status
from rest_framework.response import Response
import json
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.six import BytesIO
from rest_framework.parsers import JSONParser
import boto
import mimetypes
import json

conn = boto.connect_s3('AKIAJAR7VA2F2TABRFTQ', '4k0B2GkxJpdcseh2BChaCzgb2O0QWq78kQmcNg2i')

def sign_s3_upload(request):
    object_name = request.GET['objectName']
    content_type = mimetypes.guess_type(object_name)[0]
    filename = 'files/' + object_name
    signed_url = conn.generate_url(
        300,
        "PUT",
        'dr-1807-tesis',
        filename,
        headers = {'Content-Type': content_type, 'x-amz-acl':'public-read'})

    return HttpResponse(json.dumps({
        'signedUrl': signed_url,
        'filename': filename
    }))


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()

class EchoView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED)

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def ws(request):
    return render(request, 'index.html')

def requestTest(request):
    return render(request, 'wsTest.html')

@csrf_exempt
class WsTestView(View):
    def post(self, request, *args, **kwargs):
        action = request.POST['action']
        instance = GroupWsHolder()
        instance.getGroup("pi").send({
            "text": json.dumps(action)
        })
        return HttpResponse("sex")

@csrf_exempt
def wsTest(request):
    stream = BytesIO(request.body)
    js = JSONParser().parse(stream)

    action = js
    print(action)
    instance = GroupWsHolder()
    instance.getGroup("pi").send({
        "text": json.dumps(action)
    })
    return HttpResponse("sex")