from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register("destinations", DestinationViewSet)
router.register("wishlist", WishlistViewSet)
router.register("notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    # ======================
    # ROUTER URLS
    # ======================
    path("", include(router.urls)),

    # ======================
    # MAIN FEATURES
    # ======================
    path("short-notice/", short_notice_destinations),
    path("hotels/", hotel_list),
    path("food/", food_place_list),
    path("routes/", travel_routes),
    path("notifications/mark-read/", mark_notifications_read),
    path("bookings/<int:id>/delete/", delete_booking),

    # ======================
    # BOOKINGS (NEW)
    # ======================
    path("bookings/history/", booking_history),                  # GET → booking history
    path("bookings/create/", create_booking),            # POST → create after payment
    path("bookings/cancel/<int:booking_id>/", cancel_booking),
    path("bookings/ticket/<int:booking_id>/", download_ticket),# POST → cancel booking
]
