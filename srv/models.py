from django.db import models

# Create your models here.
class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=64)

    class Meta:
        db_table = "usuario"

    def __str__(self):
        return self.nombre + " " + self.email + ": " + self.password

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