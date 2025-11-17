from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "is_read", "created_at")
    search_fields = ("user__username", "type")
    list_filter = ("is_read",)
