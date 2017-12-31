from django.utils.functional import SimpleLazyObject
from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
import jwt
from srv.models import Usuario

class JWTAuthenticationMiddleware(MiddlewareMixin):
    auth_type = 'bearer'

    def get_authorization_data(self, request):
        authorization = request.META.get('HTTP_AUTHORIZATION', '')

        if not authorization:
            raise ValueError('El Authorization header esta vacio.')

        try:
            auth_type, data = authorization.split(' ', 1)
        except:
            raise ValueError('Authorization debe tener un espacio separando auth_type y data.')

        if auth_type.lower() != self.auth_type:
            raise ValueError('auth_type no es "%s".' % self.auth_type)

        return data

    def extract_payload(self, request):
        try:
            token = self.get_authorization_data(request)
            payload = jwt.decode(token, settings.SECRET_KEY)
        except:
            raise ValueError('Autenticacion invalida. No se pudo decodificar el token.')

        return payload

    def get_user_jwt(self, request):
        user = None
        try:
            payload = self.extract_payload(request)
            user = Usuario.objects.get(pk=payload['id'])
        except:
            pass

        return user or AnonymousUser()

    def process_request(self, request):
        request.user = SimpleLazyObject(lambda : self.get_user_jwt(request))

