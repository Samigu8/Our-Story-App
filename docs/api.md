# 📚 API Documentation

Base URL:

```text
https://our-story-backend-wsog.onrender.com
```

The local base URL is `http://localhost:3000`.

Protected endpoints require:

```http
Authorization: Bearer <token>
```

JSON endpoints use:

```http
Content-Type: application/json
```

## 🩺 Health

### `GET /health`

Returns `200 OK` when the backend process is running. This endpoint does not require authentication and does not query the database.

## 🔐 Authentication

### `POST /auth/register`

Creates a user account.

Request:

```json
{
  "email": "example@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "message": "User registered",
  "user": {
    "id": 1,
    "email": "example@example.com",
    "createdAt": "2026-10-01T00:00:00.000Z"
  }
}
```

### `POST /auth/login`

Authenticates a user and returns a JWT. Login is rate-limited to five attempts per minute.

Request:

```json
{
  "email": "example@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "message": "Login successful",
  "token": "jwt-token-here"
}
```

## 📝 Timeline

All timeline routes require a JWT.

### `GET /timeline`

Returns timeline events.

### `POST /timeline`

Creates a timeline event.

Request:

```json
{
  "title": "Wedding Day",
  "date": "Apr 17, 2026",
  "description": "The happiest day of our lives.",
  "imageUrl": "https://res.cloudinary.com/example/image/upload/wedding.jpg"
}
```

The date format is `Mon D, YYYY`, for example `Apr 17, 2026`.

### `PUT /timeline/:id`

Updates a timeline event using the same request body as `POST /timeline`.

### `DELETE /timeline/:id`

Deletes a timeline event.

## 💌 Love Notes

All love-note routes require a JWT.

- `GET /lovenotes`
- `POST /lovenotes`
- `PUT /lovenotes/:id`
- `DELETE /lovenotes/:id`

Create or update request:

```json
{
  "message": "You make every day brighter.",
  "author": "From Me",
  "date": "Mar 26, 2026",
  "color": "from-pink-400 to-rose-400"
}
```

## 🗂 Memory Photos

All memory-photo routes require a JWT.

- `GET /memories/photos`
- `POST /memories/photos`
- `PUT /memories/photos/:id`
- `DELETE /memories/photos/:id`

Create or update request:

```json
{
  "caption": "A favorite afternoon",
  "imageUrl": "https://res.cloudinary.com/example/image/upload/memory.jpg"
}
```

## ✅ Validation and Errors

Invalid request payloads return `400` with field-level errors:

```json
{
  "message": "Please correct the highlighted fields.",
  "errors": {
    "title": "Title is required."
  }
}
```

Unauthorized requests return `401`. Missing or invalid Bearer tokens are rejected by JWT middleware.
