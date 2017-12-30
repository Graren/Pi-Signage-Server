from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from srv.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True,
                                   validators=[UniqueValidator(queryset=Usuario.objects.all())])
    password = serializers.CharField(min_length=6, max_length=100, write_only=True)

    def create(self, validated_data):
        user = Usuario(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = Usuario
        fields = ('id', 'email', 'password')
