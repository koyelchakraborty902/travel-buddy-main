from urllib import response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.http import HttpResponse

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors


from .models import (
    Destination,
    Wishlist,
    Notification,
    Hotel,
    FoodPlace,
    TravelRoute,
    Booking,
)

from .serializers import (
    DestinationSerializer,
    WishlistSerializer,
    NotificationSerializer,
    HotelSerializer,
    FoodPlaceSerializer,
    TravelRouteSerializer,
    BookingSerializer,
)

import qrcode
from io import BytesIO
import os
from django.conf import settings

# =====================================
# SHORT-NOTICE DESTINATIONS (PUBLIC)
# =====================================
@api_view(["GET"])
@permission_classes([AllowAny])
def short_notice_destinations(request):
    mood = request.GET.get("mood")
    days = int(request.GET.get("days", 10))

    destinations = Destination.objects.filter(
        reachable_within_days__lte=days
    )

    if mood:
        destinations = destinations.filter(mood=mood)

    serializer = DestinationSerializer(destinations, many=True)
    return Response(serializer.data)


# =====================================
# DESTINATION CRUD (PUBLIC)
# =====================================
class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]


# =====================================
# WISHLIST (PUBLIC)
# =====================================
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [AllowAny]


# =====================================
# NOTIFICATIONS (PUBLIC)
# =====================================
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]
# ✅ MARK ALL NOTIFICATIONS AS READ
@api_view(["POST"])
@permission_classes([AllowAny])
def mark_notifications_read(request):
    Notification.objects.filter(is_read=False).update(is_read=True)
    return Response({"message": "All marked as read"})



# =====================================
# HOTELS (PUBLIC)
# =====================================
@api_view(["GET"])
@permission_classes([AllowAny])
def hotel_list(request):
    destination_id = request.GET.get("destination")
    hotels = Hotel.objects.all()

    if destination_id:
        hotels = hotels.filter(destination_id=destination_id)

    serializer = HotelSerializer(hotels, many=True)
    return Response(serializer.data)


# =====================================
# FOOD PLACES (PUBLIC)
# =====================================
@api_view(["GET"])
@permission_classes([AllowAny])
def food_place_list(request):
    destination_id = request.GET.get("destination")
    food_places = FoodPlace.objects.all()

    if destination_id:
        food_places = food_places.filter(destination_id=destination_id)

    serializer = FoodPlaceSerializer(food_places, many=True)
    return Response(serializer.data)


# =====================================
# TRAVEL ROUTES (PUBLIC)
# =====================================
@api_view(["GET"])
@permission_classes([AllowAny])
def travel_routes(request):
    destination_id = request.GET.get("destination")
    routes = TravelRoute.objects.all()

    if destination_id:
        routes = routes.filter(destination_id=destination_id)

    serializer = TravelRouteSerializer(routes, many=True)
    return Response(serializer.data)


# =====================================
# CREATE BOOKING
# =====================================
@api_view(["POST"])
@permission_classes([AllowAny])
def create_booking(request):
    data = request.data

    try:
        booking = Booking.objects.create(
    destination=Destination.objects.get(id=data["destination"]),
    hotel=Hotel.objects.get(id=data["hotel"]),
    stay_days=data["stay_days"],
    total_cost=data["total_cost"],
    journey_date=data["journey_date"],
    travel_mode=data["travel_mode"],
    status=data.get("status", "CONFIRMED"),
)

        # ✅ Create notification
        Notification.objects.create(
            message=f"Booking confirmed for {booking.destination.name}",
            link="/booking-history"
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
         print("❌ BOOKING ERROR:", e)
         return Response({"error": str(e)}, status=400)



# GET BOOKING HISTORY
@api_view(["GET"])
@permission_classes([AllowAny])
def booking_history(request):
    bookings = Booking.objects.all().order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

# CANCEL BOOKING
@api_view(["POST"])
@permission_classes([AllowAny])
def cancel_booking(request, booking_id):
    booking = Booking.objects.get(id=booking_id)
    booking.status = "CANCELLED"
    booking.cancelled_at = timezone.now()
    booking.save()

    # 🔔 Notification on cancel
    Notification.objects.create(
        message=f"Booking cancelled for {booking.destination.name}",
        link="/booking-history"
    )

    return Response({"message": "Cancelled"})


@api_view(['DELETE'])
def delete_booking(request, id):
    booking = Booking.objects.get(id=id)

    if booking.status != "CANCELLED":
        return Response({"error": "Only cancelled bookings can be deleted"}, status=400)

    booking.delete()
    return Response({"message": "Deleted"})

# DOWNLOAD PDF
@api_view(["GET"])
@permission_classes([AllowAny])
def download_ticket(request, booking_id):
    booking = Booking.objects.get(id=booking_id)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="ticket_{booking.id}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    # ===== HEADER BAR =====
    p.setFillColorRGB(0.05, 0.55, 0.35)
    p.rect(0, height - 90, width, 90, fill=1)

    # ===== LOGO =====
    logo_path = os.path.join(settings.BASE_DIR, "travel/static/logo.png")
    if os.path.exists(logo_path):
        p.drawImage(logo_path, 40, height - 80, width=70, height=70, mask='auto')

    # ===== TITLE =====
    p.setFont("Helvetica-Bold", 24)
    p.setFillColor(colors.white)
    p.drawString(140, height - 55, "TRAVELBUDDY E-TICKET")

    # ===== MAIN CARD =====
    p.setFillColor(colors.white)
    p.roundRect(40, height - 520, width - 80, 380, 15, fill=0)

    # ===== TEXT CONTENT =====
    p.setFont("Helvetica", 13)
    p.setFillColor(colors.black)

    y = height - 150
    line_gap = 28

    p.drawString(80, y, f"Booking ID: {booking.id}")
    y -= line_gap

    p.drawString(80, y, f"Destination: {booking.destination.name}")
    y -= line_gap

    p.drawString(80, y, f"Hotel: {booking.hotel.name}")
    y -= line_gap

    p.drawString(80, y, f"Journey Date: {booking.journey_date}")
    y -= line_gap

    # Travel mode with emoji icon
    travel_icon = "🚆" if booking.travel_mode.lower() == "train" else "🚌"
    p.drawString(80, y, f"Travel Mode: {travel_icon} {booking.travel_mode}")
    y -= line_gap

    p.drawString(80, y, f"Stay Days: {booking.stay_days}")
    y -= line_gap

    p.drawString(80, y, f"Total Paid: ₹{booking.total_cost}")
    y -= line_gap

    p.drawString(80, y, f"Status: {booking.status}")

    # ===== QR CODE =====
    qr_data = f"""
    Booking ID: {booking.id}
    Destination: {booking.destination.name}
    Journey Date: {booking.journey_date}
    Mode: {booking.travel_mode}
    """

    qr = qrcode.make(qr_data)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)

    qr_image = ImageReader(buffer)
    p.drawImage(qr_image, width - 220, height - 480, 150, 150)

    # Footer text
    p.setFont("Helvetica-Oblique", 10)
    p.setFillColor(colors.grey)
    p.drawString(80, height - 500, "Scan QR at boarding gate")

    p.showPage()
    p.save()

    return response