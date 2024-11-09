# library/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Project, Review
from .serializers import ProjectSerializer, ReviewSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        """
        List and retrieve are public, other actions require permissions
        """
        if self.action in ['list', 'retrieve', 'reviews', 'user_review']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get all reviews for a project"""
        try:
            project = self.get_object()
            reviews = Review.objects.filter(project=project)
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error getting reviews: {e}")  # Debug print
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Create a review for a project"""
        try:
            project = self.get_object()
            
            # Check if user already reviewed this project
            existing_review = Review.objects.filter(
                project=project,
                user=request.user
            ).first()

            if existing_review:
                return Response(
                    {'error': 'You have already reviewed this project'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            data = {
                **request.data,
                'project': project.id,
                'user': request.user.id
            }
            serializer = ReviewSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error creating review: {e}")  # Debug print
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def user_review(self, request, pk=None):
        """Get the current user's review for a project"""
        try:
            project = self.get_object()
            review = Review.objects.filter(
                project=project,
                user=request.user
            ).first()
            
            if review:
                serializer = ReviewSerializer(review)
                return Response(serializer.data)
            return Response(
                {'message': 'No review found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error getting user review: {e}")  # Debug print
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)