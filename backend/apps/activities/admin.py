from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "steps", "timestamp")
    search_fields = ("user__username", "type")
