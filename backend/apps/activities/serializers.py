from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "user", "type", "steps", "duration_minutes", "distance_km", "calories", "source", "timestamp"]
        read_only_fields = ["user"]
