from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# =========================
# DESTINATION
# =========================
class Destination(models.Model):
    MOOD_CHOICES = [
        ('Relax', 'Relax'),
        ('Adventure', 'Adventure'),
        ('Romantic', 'Romantic'),
        ('Cultural', 'Cultural'),
    ]

    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="India")
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)

    image = models.URLField()
    description = models.TextField()

    # 🔑 CORE FEATURE
    reachable_within_days = models.IntegerField(
        help_text="User can reach destination within these days"
    )

    is_offbeat = models.BooleanField(default=True)

    budget = models.CharField(max_length=50)
    best_time = models.CharField(max_length=50)

    def __str__(self):
        return self.name


# =========================
# HOTEL
# =========================
class Hotel(models.Model):
    HOTEL_TYPE_CHOICES = [
        ("Budget", "Budget"),
        ("Mid-range", "Mid-range"),
        ("Luxury", "Luxury"),
        ("Homestay", "Homestay"),
    ]

    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="hotels"
    )

    name = models.CharField(max_length=100)
    price_per_night = models.IntegerField()
    hotel_type = models.CharField(max_length=50, choices=HOTEL_TYPE_CHOICES)

    image = models.URLField()
    rating = models.FloatField(default=4.0)

    def __str__(self):
        return f"{self.name} ({self.destination.name})"


# =========================
# FOOD PLACES
# =========================
class FoodPlace(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="food_places"
    )

    name = models.CharField(max_length=100)
    food_type = models.CharField(max_length=100)
    avg_cost = models.IntegerField()
    image = models.URLField()

    def __str__(self):
        return f"{self.name} - {self.destination.name}"


# =========================
# TRAVEL ROUTES (FINAL VERSION)
# =========================
class TravelRoute(models.Model):
    ROUTE_TYPE_CHOICES = [
        ("Train", "Train"),
        ("Bus", "Bus"),
        ("Flight", "Flight"),
    ]

    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="routes"
    )

    route_type = models.CharField(max_length=20, choices=ROUTE_TYPE_CHOICES)

    from_city = models.CharField(
        max_length=100,
        default="Kolkata"
    )

    travel_time_hours = models.FloatField(
        default=0
    )

    approx_cost = models.IntegerField(
        default=0
    )

    def __str__(self):
        return f"{self.route_type} from {self.from_city}"


# =========================
# WISHLIST
# =========================
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.destination.name}"


# =========================
# NOTIFICATION
# =========================
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    message = models.CharField(max_length=255)
    link = models.CharField(max_length=100)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message


class Booking(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    ]

    destination = models.ForeignKey("Destination", on_delete=models.CASCADE)
    hotel = models.ForeignKey("Hotel", on_delete=models.SET_NULL, null=True)
    stay_days = models.IntegerField()
    total_cost = models.IntegerField()

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="CONFIRMED"
    )

    journey_date = models.DateField(default=timezone.localdate)

    travel_mode = models.CharField(max_length=20)  # Train / Bus / Flight

    created_at = models.DateTimeField(auto_now_add=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.destination.name} - {self.status}"