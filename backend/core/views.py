from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Appointment, ConsultationSlot, GeneratedSlot, Booking
from .serializers import AppointmentSerializer, ConsultationSlotSerializer, GeneratedSlotSerializer, BookingSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
class ConsultationSlotViewSet(viewsets.ModelViewSet):
    queryset = ConsultationSlot.objects.all()
    serializer_class = ConsultationSlotSerializer

class GeneratedSlotViewSet(viewsets.ModelViewSet):
    queryset = GeneratedSlot.objects.filter(is_booked=False)  # Afficher uniquement les créneaux libres
    serializer_class = GeneratedSlotSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        slot_id = request.data.get("slot")
        patient_id = request.data.get("patient")

        # Vérifier si le créneau est déjà réservé
        if Booking.objects.filter(slot_id=slot_id).exists():
            return Response({"error": "Ce créneau est déjà réservé."}, status=status.HTTP_400_BAD_REQUEST)

        # Créer la réservation
        booking = Booking.objects.create(slot_id=slot_id, patient_id=patient_id)

        # Marquer le créneau comme réservé
        GeneratedSlot.objects.filter(id=slot_id).update(is_booked=True)

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)