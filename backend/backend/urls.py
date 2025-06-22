from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app import views  # <-- Changed 'products' to 'app'

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'config', views.SiteConfigurationViewSet, basename='config')
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet, basename='product')


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

# This is important for serving images uploaded by the user during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)