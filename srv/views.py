from django.shortcuts import render
from django.http import HttpResponse
from srv.testWS.wsGroups import GroupWsHolder
from rest_framework import views, serializers, status
from rest_framework.response import Response

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

def wsTest(request):
    instance = GroupWsHolder()
    instance.getGroup("pi").send({
        "text": "PORNO"
    })
    return HttpResponse("sex")

