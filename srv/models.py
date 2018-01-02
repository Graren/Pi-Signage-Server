from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from datetime import datetime, timedelta
import jwt
from .managers import UserManager

# Create your models here.
class Usuario(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    nombre = models.CharField(_('first name'), max_length=30, blank=True)
    fecha_creacion = models.DateTimeField(_('date joined'), auto_now_add=True)
    activo = models.BooleanField(_('active'), default=True)

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
            'exp': int(dt.strftime('%S'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')

@receiver(post_save, sender=Usuario)
def user_post_save(sender, instance, created, **kwargs):
    if created:
        lista = Lista(nombre='Lista por defecto de {}'.format(instance.nombre))
        lista.save()
        grupo = GrupoDispositivos(lista=lista, user=instance, nombre='Lista por defecto de {}'.format(instance.nombre))
        grupo.save()
        grupo_defecto = GrupoDefecto(user=instance, grupo=grupo)
        grupo_defecto.save()

class Lista(models.Model):
    nombre = models.CharField(max_length=40)

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

class GrupoDispositivos(models.Model):
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    lista = models.ForeignKey(Lista, on_delete=models.CASCADE)

    class Meta:
        db_table = "grupo_dispositivos"

class GrupoDefecto(models.Model):
    user = models.OneToOneField(Usuario, primary_key=True, on_delete=models.CASCADE, related_name='grupo_defecto')
    grupo = models.ForeignKey(GrupoDispositivos)

    class Meta:
        db_table = "grupo_defecto"

class Dispositivo(models.Model):
    grupo = models.ForeignKey(GrupoDispositivos)
    nombre = models.CharField(max_length=100)
    direccion_mac = models.CharField(max_length=25)
    activo = models.BooleanField(_('active'), default=False)

    class Meta:
        db_table = "dispositivo"

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'dispositivo': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')

    def __str__(self):
        return self.direccion_mac
