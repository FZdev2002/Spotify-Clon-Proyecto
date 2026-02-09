from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Genre, Artist, Album, Song
from .serializers import GenreSerializer, ArtistSerializer, AlbumSerializer, SongSerializer
from .permissions import IsAdminOrReadOnly


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all().order_by("name")
    serializer_class = GenreSerializer
    permission_classes = [IsAdminOrReadOnly]


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all().order_by("name")
    serializer_class = ArtistSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        genre_id = self.request.query_params.get("genre")
        if genre_id:
            qs = qs.filter(genre_id=genre_id)
        return qs


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all().order_by("title")
    serializer_class = AlbumSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        artist_id = self.request.query_params.get("artist")
        if artist_id:
            qs = qs.filter(artist_id=artist_id)
        return qs


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all().order_by("title")
    serializer_class = SongSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        album_id = self.request.query_params.get("album")
        if album_id:
            qs = qs.filter(album_id=album_id)
        return qs


@api_view(["GET"])
@permission_classes([AllowAny])
def search(request):
    q = request.query_params.get("query", "").strip()
    if not q:
        return Response({"artists": [], "albums": [], "songs": []})

    artists = Artist.objects.filter(name__icontains=q)[:20]
    albums = Album.objects.filter(title__icontains=q)[:20]
    songs = Song.objects.filter(title__icontains=q)[:20]

    return Response({
        "artists": ArtistSerializer(artists, many=True).data,
        "albums": AlbumSerializer(albums, many=True).data,
        "songs": SongSerializer(songs, many=True).data,
    })
