from django.db import models
from django.contrib.auth import get_user_model
from datetime import timedelta, datetime
from django.core.exceptions import ValidationError

User = get_user_model()

class Patient(models.Model):
    name = models.CharField(max_length=100)  # Nom du patient
    birth_date = models.DateField(null=True, blank=True)  # Date de naissance
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création du patient

    def __str__(self):
        return self.name

class Availability(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()  # 🔹 Réajout du champ `date`
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.PositiveIntegerField(default=30)  # Durée d'une consultation (ex: 30 min)

    def clean(self):
        """ Vérifie si un rendez-vous existe déjà pour ce créneau """
        if GeneratedSlot.objects.filter(
                availability__doctor=self.doctor,
                availability__date=self.date,
                start_time__gte=self.start_time,
                start_time__lt=self.end_time
        ).exists():
            raise ValidationError("Un rendez-vous existe déjà sur ce créneau.")

    def save(self, *args, **kwargs):
        """ Génère automatiquement plusieurs sous-créneaux """
        super().save(*args, **kwargs)  # Sauvegarde l'objet principal

        # On supprime d'anciens créneaux s'il y en a déjà
        GeneratedSlot.objects.filter(availability=self).delete()

        # Générer les sous-créneaux
        current_time = datetime.combine(self.date, self.start_time)
        end_time = datetime.combine(self.date, self.end_time)

        while current_time < end_time:
            slot_end = current_time + timedelta(minutes=self.duration)
            if slot_end.time() > self.end_time:
                break  # Évite de dépasser l'heure de fin

            GeneratedSlot.objects.create(
                availability=self,
                start_time=current_time.time(),
                end_time=slot_end.time()
            )
            current_time = slot_end  # Passe au créneau suivant

    def __str__(self):
        return f"{self.doctor.get_full_name()} dispo {self.date} de {self.start_time} à {self.end_time}"


class GeneratedSlot(models.Model):
    """ Sous-créneaux créés automatiquement à partir d'une disponibilité """
    availability = models.ForeignKey(Availability, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_reserved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.availability.doctor.get_full_name()} - {self.start_time} à {self.end_time}"


class Appointment(models.Model):
    slot = models.OneToOneField(GeneratedSlot, on_delete=models.CASCADE)  # Un RDV par sous-créneau
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments")
    is_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"RDV {self.patient.get_full_name()} - {self.slot.start_time} à {self.slot.end_time}"
