from django.db import models
from django.conf import settings

class Challenge(models.Model):
    METRIC_CHOICES = [("steps", "Steps"), ("calories", "Calories"), ("minutes", "Minutes")]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    metric = models.CharField(max_length=20, choices=METRIC_CHOICES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="challenges", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
