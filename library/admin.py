# /Users/itziklugassy/Downloads/arlo/library/admin.py
from django.contrib import admin
from .models import Project, Review

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'created_at')
    list_filter = ('project',)
    search_fields = ('project__title', 'user__username', 'comments')