from rest_framework import serializers
from .models import (
    Destination,
    Wishlist,
    Notification,
    Hotel,
    FoodPlace,
    TravelRoute,
    Booking,
)


# =========================
# DESTINATION
# =========================
class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = "__all__"


# =========================
# WISHLIST
# =========================
class WishlistSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = "__all__"


# =========================
# NOTIFICATIONS
# =========================
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"


# =========================
# HOTEL
# =========================
class HotelSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(
        source="destination.name",
        read_only=True
    )

    class Meta:
        model = Hotel
        fields = "__all__"


# =========================
# FOOD PLACE
# =========================
class FoodPlaceSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(
        source="destination.name",
        read_only=True
    )

    class Meta:
        model = FoodPlace
        fields = "__all__"


# =========================
# TRAVEL ROUTE
# =========================
class TravelRouteSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(
        source="destination.name",
        read_only=True
    )

    class Meta:
        model = TravelRoute
        fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    hotel = HotelSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"