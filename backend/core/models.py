from django.db import models
from django.contrib.auth.models import User
from datetime import time, timedelta
from django.utils.timezone import now
import calendar


# Table des rôles (Médecin, Patient, Secrétaire, etc.)
class Role(models.Model):
    nom = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nom


# Table des utilisateurs
class User(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)  # Liaison avec les rôles

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.role.nom})"


# Table des rendez-vous
class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="patient_rdv")
    medecin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="medecin_rdv")
    date = models.DateField()
    heure = models.TimeField()
    motif = models.CharField(max_length=255)

    def __str__(self):
        return f"RDV {self.date} {self.heure} entre {self.patient.prenom} et Dr {self.medecin.nom}"


class ConsultationSlot(models.Model):
    DAYS_OF_WEEK = [
        ('MO', 'Lundi'),
        ('TU', 'Mardi'),
        ('WE', 'Mercredi'),
        ('TH', 'Jeudi'),
        ('FR', 'Vendredi'),
        ('SA', 'Samedi'),
        ('SU', 'Dimanche'),
    ]

    doctor = models.ForeignKey(User, on_delete=models.CASCADE)  # Médecin concerné
    day_of_week = models.CharField(max_length=2, choices=DAYS_OF_WEEK)  # Jour
    start_time = models.TimeField()  # Heure de début
    end_time = models.TimeField()  # Heure de fin
    every_two_weeks = models.BooleanField(default=False)  # Une semaine sur deux ?

    def __str__(self):
        return f"{self.get_day_of_week_display()} {self.start_time} - {self.end_time}"


from django.db import models
from django.contrib.auth.models import User

from django.db import models
from django.contrib.auth.models import User


class ConsultationSlot(models.Model):
    DAYS_OF_WEEK = [
        ('MO', 'Lundi'),
        ('TU', 'Mardi'),
        ('WE', 'Mercredi'),
        ('TH', 'Jeudi'),
        ('FR', 'Vendredi'),
        ('SA', 'Samedi'),
        ('SU', 'Dimanche'),
    ]

    doctor = models.ForeignKey(User, on_delete=models.CASCADE)  # Médecin concerné
    days_of_week = models.CharField(max_length=20, default="MO")  # Ex: "MO,WE,FR"
    start_time = models.TimeField()  # Heure de début
    end_time = models.TimeField()  # Heure de fin
    repeat_every = models.PositiveIntegerField(default=1)  # Nombre de semaines entre chaque répétition

    def __str__(self):
        return f"{self.days_of_week} {self.start_time} - {self.end_time} (toutes les {self.repeat_every} semaines)"


class GeneratedSlot(models.Model):
    consultation_slot = models.ForeignKey('ConsultationSlot', on_delete=models.CASCADE)  # Créneau parent
    date = models.DateField()  # Date spécifique du créneau
    start_time = models.TimeField()  # Heure de début
    end_time = models.TimeField()  # Heure de fin
    is_booked = models.BooleanField(default=False)  # Créneau réservé ou non

    def __str__(self):
        return f"{self.date} {self.start_time} - {self.end_time}"

    def generate_slots():
        from .models import ConsultationSlot, GeneratedSlot  # Import ici pour éviter les erreurs circulaires
        today = now().date()

        for slot in ConsultationSlot.objects.all():
            for week in range(0, 4 * slot.repeat_every, slot.repeat_every):  # Générer pour 4 semaines
                for day in slot.days_of_week.split(','):  # Ex: "MO,WE,FR"
                    weekday_number = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].index(day)
                    next_date = today + timedelta(days=(weekday_number - today.weekday()) % 7 + (week * 7))

                    # Vérifier si le créneau existe déjà
                    if not GeneratedSlot.objects.filter(consultation_slot=slot, date=next_date).exists():
                        GeneratedSlot.objects.create(
                            consultation_slot=slot,
                            date=next_date,
                            start_time=slot.start_time,
                            end_time=slot.end_time,
                        )

class Booking(models.Model):
    slot = models.OneToOneField('GeneratedSlot', on_delete=models.CASCADE)  # Un seul patient par créneau
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")  # Patient qui réserve
    created_at = models.DateTimeField(auto_now_add=True)  # Date de la réservation

    def __str__(self):
        return f"Réservation de {self.patient.username} pour {self.slot.date} {self.slot.start_time}"
