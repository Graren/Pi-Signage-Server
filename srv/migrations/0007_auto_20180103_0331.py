# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-01-03 03:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('srv', '0006_auto_20180103_0331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='archivo',
            name='url',
            field=models.CharField(max_length=255),
        ),
    ]
