from django.db import models

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
