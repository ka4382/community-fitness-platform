from django.urls import path
from .views import RegisterView, MeView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .profile_views import (
    UserProfileView, UpdateProfileView, follow_user, unfollow_user,
    following_list, followers_list, check_following
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("profile/update/", UpdateProfileView.as_view(), name="profile_update"),
    path("profile/<str:username>/", UserProfileView.as_view(), name="user_profile"),
    path("follow/<str:username>/", follow_user, name="follow_user"),
    path("unfollow/<str:username>/", unfollow_user, name="unfollow_user"),
    path("following/<str:username>/", following_list, name="following_list"),
    path("followers/<str:username>/", followers_list, name="followers_list"),
    path("check-following/<str:username>/", check_following, name="check_following"),
]
