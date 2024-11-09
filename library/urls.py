from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views

router = DefaultRouter()
router.register('api/projects', ProjectViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),
    # Frontend URLs
    path('project/', TemplateView.as_view(template_name='index.html'), name='project-list'),
    path('project/<int:pk>/', TemplateView.as_view(template_name='project_detail.html'), name='project-detail'),
    # Authentication URLs
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]