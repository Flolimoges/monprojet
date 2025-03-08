from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Availability, Appointment
from .serializers import AvailabilitySerializer, AppointmentSerializer
from datetime import datetime, timedelta

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

    def perform_create(self, serializer):
        """ Enregistre la disponibilité et génère les créneaux de RDV """
        availability = serializer.save()
        self.generate_appointments(availability)

    def generate_appointments(self, availability):
        """ Génère automatiquement des créneaux de RDV """
        start = datetime.combine(availability.date, availability.start_time)
        end = datetime.combine(availability.date, availability.end_time)
        duration = timedelta(minutes=availability.duration)

        slots = []
        while start + duration <= end:
            slots.append(Appointment(
                doctor=availability.doctor,
                date=availability.date,
                start_time=start.time(),
                end_time=(start + duration).time(),
                is_confirmed=False  # 🔹 Important : Assurer qu'ils ne sont pas déjà confirmés !
            ))
            start += duration

        Appointment.objects.bulk_create(slots)
        print(f"✅ {len(slots)} créneaux générés pour {availability.doctor.username} le {availability.date}")


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def create(self, request, *args, **kwargs):
        """ Réserver un rendez-vous en vérifiant la disponibilité """
        data = request.data
        print(f"📌 Données reçues : {data}")  # 🔹 Vérification en console Django

        # Vérifier que les champs nécessaires sont bien fournis
        if "doctor" not in data or "patient" not in data or "date" not in data or "start_time" not in data:
            return Response({"error": "Données manquantes"}, status=status.HTTP_400_BAD_REQUEST)

        # Assurer que les valeurs sont bien des chaînes avant conversion
        try:
            date_obj = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()  # Format YYYY-MM-DD
            start_time_obj = datetime.strptime(str(data["start_time"]), "%H:%M:%S").time()  # Format HH:MM:SS
        except ValueError:
            return Response({"error": "Format invalide pour la date ou l'heure"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si un créneau existe et n'est pas déjà réservé
        appointment = Appointment.objects.filter(
            doctor_id=data["doctor"], date=date_obj, start_time=start_time_obj, is_confirmed=False
        ).first()

        if not appointment:
            return Response({"error": "Ce créneau n'est pas disponible"}, status=status.HTTP_400_BAD_REQUEST)

        # Associer le patient au rendez-vous et le confirmer
        appointment.patient_id = data["patient"]
        appointment.is_confirmed = True
        appointment.save()

        return Response(AppointmentSerializer(appointment).data, status=status.HTTP_201_CREATED)
