# Spotify Clone (Django + React)

Proyecto tipo Spotify que permite:

* Panel **Admin** para gestión de música.
* Frontend **Usuarios** para navegación musical.
* API REST creada con Django REST Framework.

El usuario puede navegar:

Géneros → Artistas → Albums → Canciones

Incluye buscador global.

---

# Tecnologías utilizadas

## Backend

* Python
* Django
* Django REST Framework
* SimpleJWT
* SQLite
* CORS Headers

## Frontend Admin

* React
* Vite
* TypeScript
* React Router
* Axios

## Frontend Usuarios

* React
* Vite
* React Router
* Axios

---

# Estructura general

```
SpotifyClone-Backend
   config/
   music/
   media/
   db.sqlite3

spotify-admin (frontend admin)
spotifyusers-frontend (frontend usuarios)
```

---

# Backend (Django API)

Creado usando **PyCharm**.

## 1️. Crear entorno virtual

```bash
python -m venv .venv
```

Activar:

```
.venv\Scripts\activate
```

---

## 2️2. Instalar dependencias usadas

```bash
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install pillow
```

---

## 3️. Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 4️. Ejecutar backend

```bash
python manage.py runserver
```

API disponible en:

```
http://127.0.0.1:8000/
```

---

# Frontend Admin

Proyecto creado con **Visual Studio Code**.

## Instalar dependencias

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

URL:

```
http://localhost:5173
```

Funciones:

* CRUD Géneros
* CRUD Artistas
* CRUD Albums
* CRUD Canciones

---

# Frontend Usuarios

Frontend público sin login.

Permite navegación:

* Géneros
* Artistas
* Albums
* Canciones
* Buscador global

## Configuración especial

Puerto cambiado en:

`vite.config.ts`

```ts
server: {
  port: 5174,
  strictPort: true,
}
```

---

## Instalar dependencias

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

URL:

```
http://localhost:5174
```

---

# Notas importantes

* Backend debe estar activo antes de iniciar frontends.
* Media files (imágenes y música) se guardan en `/media`.
* CORS habilitado para desarrollo
