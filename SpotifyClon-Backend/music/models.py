from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=120)
    image = models.ImageField(upload_to="imagenes/", blank=True, null=True)

    def __str__(self):
        return self.name


class Artist(models.Model):
    name = models.CharField(max_length=120)
    image = models.ImageField(upload_to="imagenes/", blank=True, null=True)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Album(models.Model):
    title = models.CharField(max_length=120)
    image = models.ImageField(upload_to="imagenes/", blank=True, null=True)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Song(models.Model):
    title = models.CharField(max_length=120)
    audio = models.FileField(upload_to="musica/", blank=True, null=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
