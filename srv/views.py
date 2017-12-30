from django.shortcuts import render
from django.http import HttpResponse
from srv.testWS.wsGroups import GroupWsHolder
from rest_framework import views, serializers, status
from rest_framework.response import Response
from srv.serializers import UsuarioSerializer
from rest_framework.authtoken.models import Token


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

class RegistrarUsuario(views.APIView):
    def post(self, request, format='json'):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json['token'] = token.key
                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
