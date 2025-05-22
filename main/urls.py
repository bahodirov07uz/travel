from django.urls import path

from .views import *


urlpatterns = [
    path("", MainView.as_view(), name="main"),
    path("get_trip_details/<int:trip_id>/", get_trip_details, name="get_trip_details"),
    path(
        "get_trip_details_profile/<int:trip_id>/",
        get_trip_details_profile,
        name="get_trip_details_profile",
    ),
    path("register/", register, name="register"),
    path("profile_user/", ProfileUserView.as_view(), name="profile_user"),
    path("add_comment/", add_comment, name="add_comment"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("login/", login_view, name="login"),
    path("catalog/", CatalogView.as_view(), name="catalog"),
    path("city_suggestions/", city_suggestions, name="city_suggestions"),
    path("logout/", logout_view, name="logout"),
    path("add_trip/", add_trip, name="add_trip"),
    path("remove_passenger/", remove_passenger, name="remove_passenger"),
    # path("add_passenger/<int:trip_id>/", add_passenger, name="add_passenger"),
    path("remove_passenger/<int:trip_id>/", remove_passenger, name="remove_passenger"),
    path("delete_trip/<int:trip_id>/", delete_trip, name="delete_trip"),
    path("leave_trip/<int:trip_id>/", leave_trip, name="leave_trip"),
    path("start_trip/<int:trip_id>/", start_trip, name="start_trip"),
    path("end_trip/<int:trip_id>/", end_trip, name="end_trip"),
    path("change_password/", change_password, name="change_password"),
]
