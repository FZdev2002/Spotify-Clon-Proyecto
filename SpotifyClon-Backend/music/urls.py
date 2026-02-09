from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GenreViewSet, ArtistViewSet, AlbumViewSet, SongViewSet, search

router = DefaultRouter()
router.register("genres", GenreViewSet)
router.register("artists", ArtistViewSet)
router.register("albums", AlbumViewSet)
router.register("songs", SongViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("search/", search),
]
