from rest_framework import serializers
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(source="members.count", read_only=True)
    owner = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Group
        fields = ["id", "name", "description", "is_private", "owner", "members_count", "created_at"]
        read_only_fields = ["owner", "created_at"]
