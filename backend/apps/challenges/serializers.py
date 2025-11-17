from rest_framework import serializers
from .models import Challenge

class ChallengeSerializer(serializers.ModelSerializer):
    participants_count = serializers.IntegerField(source="participants.count", read_only=True)

    class Meta:
        model = Challenge
        fields = ["id", "title", "description", "metric", "start_date", "end_date", "participants_count"]
