# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-01-08 20:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('srv', '0009_auto_20180107_1329'),
    ]

    operations = [
        migrations.AddField(
            model_name='archivo',
            name='ajuste',
            field=models.CharField(default='cover', max_length=12),
        ),
    ]
