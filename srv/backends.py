import jwt

from django.conf import settings
from rest_framework import authentication, exceptions
import logging
from srv.models import Usuario

class AuthBackend(object):
    def authenticate(self, email, password):
        try:
            user = Usuario.objects.get(email=email)
            if user.check_password(password):
                return user
            else:
                return None
        except Usuario.DoesNotExist:
            logging.getLogger("error_logger").error("Este usuerio no existe")
            return None
        except Exception as e:
            logging.getLogger("error_logger").error(repr(e))
            return None

    def get_user(self, user_id):
        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return None
