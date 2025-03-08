from django.db import models
from django.contrib.auth import get_user_model
from datetime import timedelta, datetime

User = get_user_model()  # Utilisation du User de Django

# Table des rôles (Médecin, Patient, Secrétaire, etc.)
class Role(models.Model):
    nom = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nom


# Table des disponibilités des médecins
class Availability(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)  # Médecin
    date = models.DateField()  # Date du créneau
    start_time = models.TimeField()  # Heure de début
    end_time = models.TimeField()  # Heure de fin
    duration = models.PositiveIntegerField(default=30)  # Durée d'une consultation (ex: 30 min)

    def __str__(self):
        return f"{self.doctor.get_full_name()} dispo {self.date} de {self.start_time} à {self.end_time}"


# Table des rendez-vous
class Appointment(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)  # Médecin
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments", null=True, blank=True)  # Patient
    date = models.DateField()  # Date du rendez-vous
    start_time = models.TimeField()  # Heure de début
    end_time = models.TimeField(null=True, blank=True)  # Heure de fin
    is_confirmed = models.BooleanField(default=False)  # Confirmation du RDV

    def save(self, *args, **kwargs):
        """ Calcul automatique de l'heure de fin si non défini """
        if not self.end_time:
            self.end_time = (datetime.combine(self.date, self.start_time) + timedelta(minutes=30)).time()
        super().save(*args, **kwargs)

    def __str__(self):
        patient_name = self.patient.get_full_name() if self.patient else "Non assigné"
        return f"RDV {patient_name} avec {self.doctor.get_full_name()} le {self.date} de {self.start_time} à {self.end_time}"
