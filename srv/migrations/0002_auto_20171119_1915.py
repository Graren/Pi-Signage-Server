# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-19 23:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('srv', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='archivo',
            table='archivo',
        ),
        migrations.AlterModelTable(
            name='dispositivo',
            table='dispositivo',
        ),
        migrations.AlterModelTable(
            name='grupo_dispositivos',
            table='grupo_dispositivos',
        ),
        migrations.AlterModelTable(
            name='lista',
            table='lista',
        ),
        migrations.AlterModelTable(
            name='usuario',
            table='usuario',
        ),
    ]