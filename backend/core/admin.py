from django.contrib import admin
from .models import Availability, Appointment, Patient, GeneratedSlot

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'date', 'start_time', 'end_time', 'duration')

@admin.register(GeneratedSlot)
class GeneratedSlotAdmin(admin.ModelAdmin):
    list_display = ('availability', 'start_time', 'end_time', 'is_reserved')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('slot', 'patient', 'is_confirmed')