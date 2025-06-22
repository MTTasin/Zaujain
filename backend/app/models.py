import os
from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver

class SiteConfiguration(models.Model):
    site_name = models.CharField(max_length=255, default="Zaujain Nikah Point")
    # NEW: Added logo field
    logo = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Upload your site logo here.")
    phone_number = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    facebook_link = models.URLField(blank=True)
    instagram_link = models.URLField(blank=True)

    def __str__(self):
        return "Site Configuration"

    class Meta:
        verbose_name_plural = "Site Configuration"

class Category(models.Model):
    # ... (no changes in this model)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True, help_text="A unique slug for URL generation. Will be auto-generated if left blank.")
    def save(self, *args, **kwargs):
        if not self.slug: self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def __str__(self): return self.name
    class Meta: verbose_name_plural = "Categories"

class Product(models.Model):
    # ... (no changes in this model)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    is_featured = models.BooleanField(default=False, help_text="Mark as featured to show on the homepage.")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name
    def get_cover_image(self):
        first_image = self.images.first()
        return first_image.image.url if first_image else None
    class Meta: ordering = ['-created_at']

class ProductImage(models.Model):
    # ... (no changes in this model)
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')
    def __str__(self): return f"Image for {self.product.name}"

# --- Signal Receivers for file cleanup ---
# ... (no changes in signals)
@receiver(post_delete, sender=ProductImage)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    if instance.image and os.path.isfile(instance.image.path): os.remove(instance.image.path)

@receiver(pre_save, sender=ProductImage)
def auto_delete_image_on_change(sender, instance, **kwargs):
    if not instance.pk: return False
    try: old_file = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist: return False
    new_file = instance.image
    if not old_file == new_file and os.path.isfile(old_file.path): os.remove(old_file.path)