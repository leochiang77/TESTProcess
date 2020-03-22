from django.conf.urls import url
from . import views

urlpatterns=[
    url(r'item_detail/', views.item_detail, name='item_detail'),
    url(r'delete_product/', views.delete_product, name='delete_product'),
    url(r'delete_material/', views.delete_material, name='delete_material'),
    url(r'add_product/', views.add_product, name='add_product'),
    url(r'add_material/', views.add_material, name='add_material'),
    url(r'addIncomeUnits', views.addIncomeUnits, name='addIncomeUnits'),
    url(r'firstimport_income', views.firstimport_income, name='firstimport_income'),
    url(r'^$',views.income_main,name='income_main'),
	
]


