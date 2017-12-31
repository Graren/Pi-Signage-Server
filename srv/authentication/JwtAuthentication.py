from tastypie.authentication import Authentication
from django.conf import settings
import jwt
from django.utils.deprecation import MiddlewareMixin

try:
    import python_digest
except ImportError:
    python_digest = None

from srv.models import Usuario

class JwtAuthentication(Authentication):
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()

    def get_identifier(self, request):
        return request.user.id

class CreateWithoutAuthentication(JwtAuthentication):
    def is_authenticated(self, request, **kwargs):
        if request.method == 'POST':
            return True
        else:
            return super(CreateWithoutAuthentication, self).is_authenticated(request, **kwargs)