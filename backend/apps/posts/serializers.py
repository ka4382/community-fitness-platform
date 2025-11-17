from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    
    class Meta:
        model = Comment
        fields = ["id", "post", "author", "author_id", "text", "created_at", "updated_at"]
        read_only_fields = ["author", "created_at", "updated_at"]

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    text = serializers.CharField(required=False, allow_blank=True)
    media_url = serializers.URLField(required=False, allow_blank=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ["id", "author", "text", "media_url", "visibility", "like_count", "comment_count", "created_at", "comments"]
        read_only_fields = ["like_count", "comment_count", "created_at"]
    
    def validate_media_url(self, value):
        """Convert empty string to None for cleaner data"""
        if value == '' or value is None:
            return ''
        return value
