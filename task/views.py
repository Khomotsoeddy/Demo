from django.shortcuts import render
from rest_framework import viewsets
from .serialiser import  TodoSerialisers
from .models import Task

# Create your views here.
class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerialisers
    queryset = Task.objects.all()
    