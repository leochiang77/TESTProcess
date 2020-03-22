from django.shortcuts import render
from django.shortcuts import redirect
from .forms import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.safestring import mark_safe
from django.core import serializers
from .models import *
from django.db import connection
import json
from django.http import HttpResponse
import time
## dd/mm/yyyy format


# Create your views here.
@csrf_exempt
def income_main(request):
    startdate=time.strftime("%Y-%m-%d")
    sql_string="SELECT productName, sellquantity FROM coupleface.income where todaytime = '%s' ;" %startdate
   
    with connection.cursor() as cursor:
        cursor.execute(sql_string)
        sold_products = cursor.fetchall()
        temp=dict(sold_products)
        sold_products = json.dumps(temp)
	
		
	products=Product.objects.all()
	product=serializers.serialize('json',products)
	materials=Material.objects.all()
	material=serializers.serialize('json',materials)
	# incomes=Income.objects.all()
	# income=serializers.serialize('json',incomes)
	productmaterials=Productmaterial.objects.all()
	productmaterial=serializers.serialize('json',productmaterials)
	return render(request, 'coupleui/index.html', {'product':mark_safe(product),'material':mark_safe(material),'productmaterial':mark_safe(productmaterial),'todaysold':mark_safe(sold_products)})

# def product(request):
    # form = ProductForm(request.POST)
    # test="123"
    # # return redirect('/blog/product', form=test)
    # return render(request, 'coupleui/index.html', {'form': test})	
	
@csrf_exempt	
def add_product(request):
    # print(request.POST)
    productname = request.POST.get('product_name')
    price = request.POST.get('product_price')
	#print(productname)
    Product.objects.create(productname=productname,price=price)
    materialcount=request.POST.get('materialcount')
    for i in range(int(materialcount)):
        tempsname='ingredient['+ str(i)+'][materialname]'
        tempsunit='ingredient['+ str(i)+'][units]'
        materialname = request.POST.get(tempsname)
        quantity = request.POST.get(tempsunit)
        Productmaterial.objects.create(productname=productname,materialname=materialname,quantity=quantity)
    
    return render(request, 'main.html', {})
	
@csrf_exempt	
def add_material(request):
    # print(request.POST)
    materialname = request.POST.get('material_name')
    unitcost = request.POST.get('material_unicost')
    updatetime = request.POST.get('material_updatetime')
    Material.objects.create(materialname=materialname,unitcost=unitcost,updatetime=updatetime)
    
    
    return render(request, 'main.html', {})

@csrf_exempt
def delete_product(request):
    primarykey = request.POST.get('primarykey')
    Product.objects.filter(productname=primarykey).delete()
    Productmaterial.objects.filter(productname=primarykey).delete()
    print(primarykey)
    return render(request, 'main.html', {})
	
@csrf_exempt	
def delete_material(request):
    primarykey = request.POST.get('primarykey')
    Material.objects.filter(materialname=primarykey).delete()
    print(primarykey)
    return render(request, 'main.html', {})
	
@csrf_exempt	
def item_detail(request):
    productName=request.POST.get('name') 
    products_detail=Productmaterial.objects.filter(productname=productName)
    products_detail=mark_safe(serializers.serialize('json',products_detail))
    #print(products_detail)
    
    return HttpResponse(products_detail)
	
	
@csrf_exempt	
def addIncomeUnits(request):
    itemnums=request.POST.get('itemnums')
    print(request.POST)
    for i in range(int(itemnums)):
        tempsname='incomeCollection['+ str(i)+'][name]'
        tempsunit='incomeCollection['+ str(i)+'][unit]'
        #print(tempstring)
        productname = request.POST.get(tempsname)
        todaytime = request.POST.get('incomeDate')
        sellquantity = request.POST.get(tempsunit)
        #print(Collection)
        Income.objects.create(todaytime=todaytime,productname=productname,sellquantity=sellquantity)
	#print(productname)
    return render(request, 'main.html', {})
	
	
@csrf_exempt	
def firstimport_income(request):
    startdate=request.POST.get('startdate') 
    # sql_string="SELECT productName,sum(sellquantity) FROM income where todaytime > %s group by  productName;" %startdate
    sql_string="SELECT month(todaytime) ,productName, SUM(sellquantity) FROM coupleface.income where todaytime > %s GROUP BY productName,month(todaytime);" %startdate
    # print(sql_string)
    with connection.cursor() as cursor:
        cursor.execute(sql_string)
        sold_products = cursor.fetchall()
        tempsold_products={}
		
        for item in sold_products:
			key=item[1]
			tempsold_products.setdefault(key, [])
			tempdict={}
			tempdict[item[0]]=item[2]
			tempsold_products[key].append(tempdict)
				
			# print(item[0])
        # temp=dict(sold_products)
        # print(temp)
		#for delete u'
        sold_products = json.dumps(tempsold_products)
    # sold_products=Income.objects.filter(todaytime > startdate)
        # sold_products=mark_safe(serializers.serialize('json',sold_products))
        # print(sold_products)
    
    return HttpResponse(sold_products)
	
