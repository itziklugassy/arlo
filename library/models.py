# library/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    video_url = models.URLField(max_length=500)
    thumbnail = models.ImageField(upload_to='project_thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def get_average_ratings(self):
        reviews = self.review_set.all()
        if not reviews:
            return {
                'understanding': 0,
                'concept': 0,
                'execution': 0,
                'prominence': 0,
                'pride': 0,
                'originality': 0,
            }
        
        return {
            'understanding': sum(r.understanding for r in reviews) / len(reviews),
            'concept': sum(r.concept for r in reviews) / len(reviews),
            'execution': sum(r.execution for r in reviews) / len(reviews),
            'prominence': sum(r.prominence for r in reviews) / len(reviews),
            'pride': sum(r.pride for r in reviews) / len(reviews),
            'originality': sum(r.originality for r in reviews) / len(reviews),
        }

class Review(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    understanding = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    concept = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    execution = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    prominence = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    pride = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    originality = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['project', 'user']

    def __str__(self):
        return f"{self.user.username}'s review of {self.project.title}"