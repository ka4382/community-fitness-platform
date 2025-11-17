from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Challenge
from .serializers import ChallengeSerializer

class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all().order_by("-start_date")
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        challenge = self.get_object()
        challenge.participants.add(request.user)
        return Response({"joined": True})

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def leaderboard(self, request, pk=None):
        # Placeholder: should compute based on Activity and metric; caching recommended
        return Response({"leaderboard": []})
