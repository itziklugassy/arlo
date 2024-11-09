"""
Django settings for library_system project.
"""

import os
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
SECRET_KEY = 'django-insecure-x5etgo=q1*-@n)!!0l$$br7pdrb&qi+=pogz!73_x!b2xzeb+m'

DEBUG = True

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
   'django.contrib.admin',
   'django.contrib.auth',
   'django.contrib.contenttypes',
   'django.contrib.sessions',
   'django.contrib.messages',
   'django.contrib.staticfiles',
   'rest_framework',
   'rest_framework_simplejwt',
   'corsheaders',
   'library',
]

MIDDLEWARE = [
   'corsheaders.middleware.CorsMiddleware',
   'django.middleware.security.SecurityMiddleware',
   'django.contrib.sessions.middleware.SessionMiddleware',
   'django.middleware.common.CommonMiddleware',
   'django.middleware.csrf.CsrfViewMiddleware',
   'django.contrib.auth.middleware.AuthenticationMiddleware',
   'django.contrib.messages.middleware.MessageMiddleware',
   'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'library_system.urls'

TEMPLATES = [
   {
       'BACKEND': 'django.template.backends.django.DjangoTemplates',
       'DIRS': [
           os.path.join(BASE_DIR, 'frontend', 'templates'),  # Changed to include frontend directory
       ],
       'APP_DIRS': True,
       'OPTIONS': {
           'context_processors': [
               'django.template.context_processors.debug',
               'django.template.context_processors.request',
               'django.contrib.auth.context_processors.auth',
               'django.contrib.messages.context_processors.messages',
               'django.template.context_processors.media',
           ],
       },
   },
]

WSGI_APPLICATION = 'library_system.wsgi.application'

# Database
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.sqlite3',
       'NAME': BASE_DIR / 'db.sqlite3',
   }
}

# REST Framework settings
REST_FRAMEWORK = {
   'DEFAULT_AUTHENTICATION_CLASSES': (
       'rest_framework_simplejwt.authentication.JWTAuthentication',
       'rest_framework.authentication.SessionAuthentication',
   ),
   'DEFAULT_PERMISSION_CLASSES': [
       'rest_framework.permissions.AllowAny',
   ],
}

# JWT Settings
SIMPLE_JWT = {
   'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
   'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
   'ROTATE_REFRESH_TOKENS': False,
   'BLACKLIST_AFTER_ROTATION': True,
   'UPDATE_LAST_LOGIN': False,
   'ALGORITHM': 'HS256',
   'SIGNING_KEY': SECRET_KEY,
   'VERIFYING_KEY': None,
   'AUDIENCE': None,
   'ISSUER': None,
   'AUTH_HEADER_TYPES': ('Bearer',),
   'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
   'USER_ID_FIELD': 'id',
   'USER_ID_CLAIM': 'user_id',
   'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
   'TOKEN_TYPE_CLAIM': 'token_type',
   'JTI_CLAIM': 'jti',
}

# CORS Settings
CORS_ALLOWED_ORIGINS = [
   "http://localhost:8000",
   "http://127.0.0.1:8000",
   "http://localhost:8081",
   "http://127.0.0.1:8081",
]
CORS_ALLOW_ALL_ORIGINS = True  # Only for development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
   'DELETE',
   'GET',
   'OPTIONS',
   'PATCH',
   'POST',
   'PUT',
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Create media directories if they don't exist
MEDIA_DIRS = [
   os.path.join(BASE_DIR, 'media'),
   os.path.join(BASE_DIR, 'media', 'books'),
   os.path.join(BASE_DIR, 'media', 'project_thumbnails'),
]
for dir_path in MEDIA_DIRS:
   os.makedirs(dir_path, exist_ok=True)

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
   os.path.join(BASE_DIR, 'frontend', 'static'),  # Changed to include frontend directory
]

# Create static directory if it doesn't exist
for static_dir in STATICFILES_DIRS:
   os.makedirs(static_dir, exist_ok=True)

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication settings
LOGIN_URL = '/login/'  # Where to go for login
LOGIN_REDIRECT_URL = '/project/'  # Where to go after login
LOGOUT_REDIRECT_URL = '/project/'  # Where to go after logout

# Password validation
AUTH_PASSWORD_VALIDATORS = [
   {
       'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
   },
   {
       'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
   },
   {
       'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
   },
   {
       'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
   },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True