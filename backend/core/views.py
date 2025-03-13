from django.db.models import Exists, OuterRef
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Appointment, Availability, GeneratedSlot, Patient
from .serializers import AppointmentSerializer, AvailabilitySerializer, GeneratedSlotSerializer, PatientSerializer


class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

class GeneratedSlotViewSet(viewsets.ModelViewSet):
    queryset = GeneratedSlot.objects.all()  # ✅ Réintroduit `queryset`
    serializer_class = GeneratedSlotSerializer

    def get_queryset(self):
        """ Retourne les créneaux avec l'état `is_reserved` mis à jour dynamiquement. """
        return self.queryset.annotate(
            is_reserved_dynamic=Exists(Appointment.objects.filter(slot=OuterRef('pk')))
        )


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

@api_view(['GET'])
def get_patients(request):
    patients = Patient.objects.all()  # Récupère tous les patients
    serializer = PatientSerializer(patients, many=True)  # Sérialise en JSON
    return Response(serializer.data)