# library/serializers.py
from rest_framework import serializers
from .models import Project, Review

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'video_url', 'thumbnail', 'created_at', 'is_active']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # This will use the user's __str__ method

    class Meta:
        model = Review
        fields = [
            'id', 'project', 'user', 'understanding', 'concept',
            'execution', 'prominence', 'pride', 'originality',
            'comments', 'created_at'
        ]