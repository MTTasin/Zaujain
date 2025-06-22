from django.contrib import admin
from .models import SiteConfiguration, Category, Product, ProductImage

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'logo', 'phone_number', 'whatsapp_number') # Added 'logo'
    def has_add_permission(self, request):
        return SiteConfiguration.objects.count() == 0

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    # ... (no changes here)
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # ... (no changes here)
    list_display = ('name', 'category', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured')
    search_fields = ('name', 'description')
    inlines = [ProductImageInline]
