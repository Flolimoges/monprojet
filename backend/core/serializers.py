from rest_framework import serializers
from .models import Appointment, ConsultationSlot, GeneratedSlot, Booking


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class ConsultationSlotSerializer(serializers.ModelSerializer):
    days_of_week = serializers.MultipleChoiceField(
        choices=[
            ('MO', 'Lundi'), ('TU', 'Mardi'), ('WE', 'Mercredi'),
            ('TH', 'Jeudi'), ('FR', 'Vendredi'), ('SA', 'Samedi'), ('SU', 'Dimanche')
        ]
    )

    class Meta:
        model = ConsultationSlot
        fields = '__all__'


    def validate_repeat_every(self, value):
        if value not in [1, 2, 3, 4]:  # Ex: Max 1 mois
            raise serializers.ValidationError("La répétition doit être entre 1 et 4 semaines.")
        return value

class GeneratedSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedSlot
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
