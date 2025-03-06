from django.urls import path
from django.http import HttpResponse

def home(request):
    return HttpResponse("Bienvenue dans l'application Core ! 🚀")

urlpatterns = [
    path('', home, name='core-home'),
]
