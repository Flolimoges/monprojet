from rest_framework import viewsets
from .models import Appointment, Availability, GeneratedSlot
from .serializers import AppointmentSerializer, AvailabilitySerializer, GeneratedSlotSerializer

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

class GeneratedSlotViewSet(viewsets.ModelViewSet):
    queryset = GeneratedSlot.objects.all()  # 🔹 Ajout de queryset ici !
    serializer_class = GeneratedSlotSerializer

    def get_queryset(self):
        """ Met à jour `is_reserved` pour chaque créneau avant de les retourner """
        slots = GeneratedSlot.objects.all()
        for slot in slots:
            slot.is_reserved = Appointment.objects.filter(slot=slot).exists()
            slot.save()
        return slots

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
