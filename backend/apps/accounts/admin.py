from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User, Follow

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ('username', 'email', 'full_name', 'total_steps', 'total_calories')
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('full_name', 'bio', 'avatar_url', 'total_steps', 'total_calories')}),
    )

@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('follower__username', 'following__username')
