# Generated by Django 2.2.7 on 2019-12-01 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organisations', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisation',
            name='private_key',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='organisation',
            name='public_key',
            field=models.TextField(blank=True),
        ),
    ]
