from __future__ import unicode_literals

from django.db import models

# Create your models here.



class Material(models.Model):
    materialname = models.CharField(db_column='materialName', primary_key=True, max_length=50)  # Field name made lowercase.
    unitcost = models.IntegerField()
    updatetime = models.DateField(db_column='updateTime')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'material'


class Product(models.Model):
	productname = models.CharField(db_column='productName', primary_key=True, max_length=50)  # Field name made lowercase.
	price = models.IntegerField()

	class Meta:
		managed = False
		db_table = 'product'



		
class Income(models.Model):
    todaytime = models.DateField(primary_key=True,)
    productname = models.CharField(db_column='productName', max_length=50)  # Field name made lowercase.
    sellquantity = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'income'
        unique_together = (('todaytime', 'productname'),)
		
		
class Productmaterial(models.Model):
    pmid = models.AutoField(primary_key=True)
    productname = models.CharField(db_column='productName',max_length=50)  # Field name made lowercase.
    materialname = models.CharField(db_column='materialName',max_length=50)  # Field name made lowercase.
    quantity = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'productmaterial'