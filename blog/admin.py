from django.contrib import admin

# Register your models here.
from .models import Material
from .models import Product
from .models import Income
from .models import Productmaterial

admin.site.register(Material)
admin.site.register(Product)
admin.site.register(Income)
admin.site.register(Productmaterial)