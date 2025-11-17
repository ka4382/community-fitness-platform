from django.db import models
from django.conf import settings

class Activity(models.Model):
    ACTIVITY_CHOICES = [
        ("walk", "Walk"),
        ("run", "Run"),
        ("cycle", "Cycle"),
        ("other", "Other"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activities")
    type = models.CharField(max_length=20, choices=ACTIVITY_CHOICES)
    steps = models.BigIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    distance_km = models.FloatField(null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    source = models.CharField(max_length=50, default="manual")
    timestamp = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} by {self.user}"
