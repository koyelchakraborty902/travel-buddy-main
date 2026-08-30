from django.contrib import admin
from .models import (
    Destination,
    Hotel,
    FoodPlace,
    TravelRoute,
    Wishlist,
    Notification,
    Booking
)

admin.site.register(Destination)
admin.site.register(Hotel)
admin.site.register(FoodPlace)
admin.site.register(TravelRoute)
admin.site.register(Wishlist)
admin.site.register(Notification)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "destination", "hotel", "status", "created_at")
