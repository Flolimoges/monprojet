from rest_framework import serializers
from .models import Appointment, Availability, GeneratedSlot, Patient


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = '__all__'

class GeneratedSlotSerializer(serializers.ModelSerializer):
    doctor = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()  # 🔹 Ajout de la date dans l'API
    is_reserved = serializers.BooleanField(source='is_reserved_dynamic', read_only=True)

    class Meta:
        model = GeneratedSlot
        fields = ['id', 'availability', 'start_time', 'end_time', 'is_reserved', 'doctor', 'date']

    def get_doctor(self, obj):
        return obj.availability.doctor.id  # 🔹 Récupère l'ID du médecin

    def get_date(self, obj):
        return obj.availability.date  # 🔹 Récupère la date depuis Availability

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['slot', 'patient', 'is_confirmed']

    def validate(self, data):
        """ Empêcher la double réservation d'un sous-créneau """
        if Appointment.objects.filter(slot=data['slot']).exists():
            raise serializers.ValidationError("Ce créneau est déjà réservé.")
        return data

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'  # Inclut tous les champs du modèle