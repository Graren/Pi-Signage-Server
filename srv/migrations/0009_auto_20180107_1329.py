# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-01-07 13:29
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('srv', '0008_auto_20180104_1653'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dispositivo',
            old_name='direccion_mac',
            new_name='bssid',
        ),
    ]
