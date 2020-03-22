# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-21 13:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Income',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('todaytime', models.DateField()),
                ('sellquantity', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'income',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Material',
            fields=[
                ('materialname', models.CharField(db_column='materialName', max_length=50, primary_key=True, serialize=False)),
                ('unitcost', models.IntegerField()),
                ('updatetime', models.DateField(db_column='updateTime')),
            ],
            options={
                'db_table': 'material',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('productname', models.CharField(db_column='productName', max_length=50, primary_key=True, serialize=False)),
                ('price', models.IntegerField()),
            ],
            options={
                'db_table': 'product',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Productmaterial',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'productmaterial',
                'managed': False,
            },
        ),
    ]
