from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from srv.testWS.wsGroups import GroupWsHolder
from rest_framework import views, serializers, status
from rest_framework.response import Response
import json
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.six import BytesIO
from rest_framework.parsers import JSONParser

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

    action = js['action']
    instance = GroupWsHolder()
    instance.getGroup("pi").send({
        "text": json.dumps(action)
    })
    return HttpResponse("sex")

