import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestAccountsAPI:
    def test_user_registration(self):
        client = APIClient()
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "full_name": "Test User"
        }
        response = client.post("/api/auth/register/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username="testuser").exists()

    def test_user_login(self):
        # Create user
        user = User.objects.create_user(
            username="logintest",
            email="login@example.com",
            password="testpass123"
        )
        
        # Login
        client = APIClient()
        data = {"username": "logintest", "password": "testpass123"}
        response = client.post("/api/auth/login/", data)
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_get_user_profile(self):
        user = User.objects.create_user(
            username="profiletest",
            email="profile@example.com",
            password="testpass123"
        )
        
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/auth/me/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "profiletest"
