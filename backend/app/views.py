from rest_framework import viewsets, response, status
from .models import SiteConfiguration, Category, Product
from .serializers import SiteConfigurationSerializer, CategorySerializer, ProductSerializer

class SiteConfigurationViewSet(viewsets.ViewSet):
    def list(self, request):
        config = SiteConfiguration.objects.first()
        if not config:
            config = SiteConfiguration.objects.create()
        serializer = SiteConfigurationSerializer(config)
        return response.Response(serializer.data)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.prefetch_related('images').all()
        
        category_slug = self.request.query_params.get('category')
        if category_slug is not None:
            queryset = queryset.filter(category__slug=category_slug)
            
        is_featured = self.request.query_params.get('featured')
        if is_featured is not None and is_featured.lower() in ['true', '1']:
            queryset = queryset.filter(is_featured=True)
            
        return queryset