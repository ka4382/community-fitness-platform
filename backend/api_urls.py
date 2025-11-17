from django.urls import path, include

urlpatterns = [
    path("auth/", include("apps.accounts.urls")),
    path("posts/", include("apps.posts.urls")),
    path("activities/", include("apps.activities.urls")),
    path("challenges/", include("apps.challenges.urls")),
    path("groups/", include("apps.groups.urls")),
    path("notifications/", include("apps.notifications.urls")),
]
