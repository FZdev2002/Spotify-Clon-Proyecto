from rest_framework import serializers
from .models import Genre, Artist, Album, Song


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name", "image"]


class ArtistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = ["id", "name", "image", "genre"]


class AlbumSerializer(serializers.ModelSerializer):

    artist_name = serializers.CharField(source="artist.name", read_only=True)
    artist_image = serializers.ImageField(source="artist.image", read_only=True)

    class Meta:
        model = Album
        fields = ["id", "title", "image", "artist", "artist_name", "artist_image"]

class SongSerializer(serializers.ModelSerializer):

    album_title = serializers.CharField(source="album.title", read_only=True)

    class Meta:
        model = Song
        fields = ["id", "title", "audio", "album","album_title"]
