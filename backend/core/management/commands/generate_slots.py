from django.core.management.base import BaseCommand
from ...utils import generate_slots

class Command(BaseCommand):
    help = 'Génère les créneaux de consultation pour les prochaines semaines.'

    def handle(self, *args, **kwargs):
        generate_slots()
        self.stdout.write(self.style.SUCCESS('Créneaux générés avec succès !'))
