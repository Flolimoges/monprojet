from django.http import HttpResponse
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AvailabilityViewSet, AppointmentViewSet, GeneratedSlotViewSet

router = DefaultRouter()
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'generated-slots', GeneratedSlotViewSet)
router.register(r'appointments', AppointmentViewSet)

def home(request):
    return HttpResponse("Bienvenue dans l'application Core ! 🚀")

urlpatterns = [
    path('', home, name='core-home'),
    path('api/', include(router.urls)),
]
