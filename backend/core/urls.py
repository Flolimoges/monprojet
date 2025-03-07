from django.urls import path, include
from django.http import HttpResponse
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, ConsultationSlotViewSet, GeneratedSlotViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet)
router.register(r'consultation-slots', ConsultationSlotViewSet)
router.register(r'generated-slots', GeneratedSlotViewSet)
router.register(r'bookings', BookingViewSet)



def home(request):
    return HttpResponse("Bienvenue dans l'application Core ! 🚀")


urlpatterns = [
    path('', home, name='core-home'),
    path('api/', include(router.urls)),
]

