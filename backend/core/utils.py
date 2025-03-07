from datetime import timedelta
from django.utils.timezone import now
from .models import ConsultationSlot, GeneratedSlot  # Importation des modèles

def generate_slots():
    today = now().date()

    for slot in ConsultationSlot.objects.all():
        for week in range(0, 4 * slot.repeat_every, slot.repeat_every):  # Générer sur 4 semaines
            for day in slot.days_of_week.split(','):  # Ex: "MO,WE,FR"
                weekday_number = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].index(day)
                next_date = today + timedelta(days=(weekday_number - today.weekday()) % 7 + (week * 7))

                if not GeneratedSlot.objects.filter(consultation_slot=slot, date=next_date).exists():
                    GeneratedSlot.objects.create(
                        consultation_slot=slot,
                        date=next_date,
                        start_time=slot.start_time,
                        end_time=slot.end_time,
                    )
