from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
import jwt
from .managers import UserManager

# Create your models here.
class Usuario(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    nombre = models.CharField(_('first name'), max_length=30, blank=True)
    fecha_creacion = models.DateTimeField(_('date joined'), auto_now_add=True)
    esta_activo = models.BooleanField(_('active'), default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "usuario"
        verbose_name = _('usuario')
        verbose_name_plural = _('usuarios')

    def get_full_name(self):
        return self.nombre

    def get_short_name(self):
        return self.nombre

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')

class Lista(models.Model):
    nombre= models.CharField(max_length=40)

    class Meta:
        db_table = "lista"

    def __str__(self):
        return self.nombre

class Archivo(models.Model):
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    lista = models.ForeignKey(Lista)
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=30)

    class Meta:
        db_table = "archivo"


    def __str__(self):
        return self.nombre + " " + self.tipo

class Grupo_Dispositivos(models.Model):
    user= models.ForeignKey(Usuario, on_delete=models.CASCADE)
    lista= models.ForeignKey(Lista, on_delete=models.CASCADE)

    class Meta:
        db_table = "grupo_dispositivos"

class Dispositivo(models.Model):
    grupo = models.ForeignKey(Grupo_Dispositivos)
    direccion_mac = models.CharField(max_length=25)

    class Meta:
        db_table = "dispositivo"


    def __str__(self):
        return self.direccion_mac