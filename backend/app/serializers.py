from rest_framework import serializers
from .models import SiteConfiguration, Category, Product, ProductImage

class SiteConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteConfiguration
        fields = ('site_name', 'logo', 'phone_number', 'whatsapp_number', 'facebook_link', 'instagram_link') # Added 'logo'

class CategorySerializer(serializers.ModelSerializer):
    # ... (no changes here)
    class Meta: model = Category; fields = ('id', 'name', 'slug')
class ProductImageSerializer(serializers.ModelSerializer):
    # ... (no changes here)
    class Meta: model = ProductImage; fields = ('id', 'image')
class ProductSerializer(serializers.ModelSerializer):
    # ... (no changes here)
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'category', 'category_name', 'is_featured', 'images')