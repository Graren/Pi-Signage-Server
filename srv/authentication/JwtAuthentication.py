from tastypie.authentication import Authentication
from django.conf import settings
import jwt
from tastypie.http import HttpUnauthorized

try:
    import python_digest
except ImportError:
    python_digest = None

from srv.models import Usuario

class JwtAuthentication(Authentication):
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


    def is_authenticated(self, request, **kwargs):
        try:
            payload = self.extract_payload(request)
            try:
                user = Usuario.objects.get(pk=payload['id'])
            except Usuario.DoesNotExist:
                return False

            if not user.esta_activo:
                return False

            return True
        except ValueError:
            return False

    def get_identifier(self, request):
        try:
            payload = self.extract_payload(request)
        except ValueError:
            return ''

        return payload['id']

class CreateWithoutAuthentication(JwtAuthentication):
    def is_authenticated(self, request, **kwargs):
        if request.method == 'POST':
            return True
        else:
            return super(CreateWithoutAuthentication, self).is_authenticated(request, **kwargs)