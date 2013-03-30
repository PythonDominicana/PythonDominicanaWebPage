from datetime import datetime
from django.contrib.auth.models import User
from django.shortcuts import render
from mezzanine.blog.models import BlogPost
from mezzanine_slides.models import Slide


__author__ = 'eneldoserrata'


def home(request):
    if request.user.is_superuser:
        posts = BlogPost.objects.all()
    else:
        posts = BlogPost.objects.filter(status=2)
    slides = Slide.objects.filter(page_id=1)
    return render(request, "index.html", {"slides":slides, "posts":posts})
