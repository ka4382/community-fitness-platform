from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet

router = DefaultRouter()
router.register("", PostViewSet, basename="post")

urlpatterns = [
    path("", include(router.urls)),
    path("comments/", include([
        path("", CommentViewSet.as_view({'get': 'list', 'post': 'create'})),
        path("<int:pk>/", CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})),
    ])),
]
