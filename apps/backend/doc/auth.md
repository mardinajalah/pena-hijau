# API Specification — Authentication & Admin Profile (`auth.md`)

Dokumentasi spesifikasi API dan kontrak data untuk autentikasi admin dashboard komunitas Pena Hijau.

---

## Base URL
```
http://localhost:4000/api/v1/auth
```

---

## Daftar Endpoint

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| `POST` | `/login` | Login admin menggunakan email/username & password | Public |
| `POST` | `/refresh-token` | Memperbarui access token JWT menggunakan refresh token | Public |
| `POST` | `/logout` | Logout dan mencabut validity refresh token | Protected (Bearer Token) |
| `GET` | `/me` | Mengambil data profil admin yang sedang login | Protected (Bearer Token) |

---

## 1. Login Admin

Melakukan autentikasi akun administrator untuk masuk ke panel `apps/dashboard`.

- **Method**: `POST`
- **Route**: `/api/v1/auth/login`
- **Akses**: Public

### Request Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "email": "admin@penahijau.org",
  "password": "password123"
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Taufiqur Rohim",
      "email": "admin@penahijau.org",
      "role": "Super Admin",
      "avatar": "/avatars/admin.webp"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "d8e7f6a5b4c3d2e1f0...",
      "expiresIn": "1d"
    }
  }
}
```

### Response Body Failed — Kredensial Salah (401 Unauthorized)
```json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Email atau password yang Anda masukkan salah"
}
```

### Response Body Failed — Validasi Input Gagal (400 Bad Request)
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validasi input gagal",
  "details": [
    {
      "field": "email",
      "message": "Format email tidak valid"
    },
    {
      "field": "password",
      "message": "Password minimal 6 karakter"
    }
  ]
}
```

---

## 2. Refresh Access Token

Memperbarui access token yang telah kadaluarsa tanpa harus login ulang.

- **Method**: `POST`
- **Route**: `/api/v1/auth/refresh-token`
- **Akses**: Public

### Request Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "refreshToken": "d8e7f6a5b4c3d2e1f0..."
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "1d"
  }
}
```

### Response Body Failed — Refresh Token Invalid / Kadaluarsa (401 Unauthorized)
```json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Refresh token tidak valid atau sudah kadaluarsa. Silakan login kembali."
}
```

---

## 3. Logout Admin

Mencabut validity refresh token admin saat keluar dari dashboard.

- **Method**: `POST`
- **Route**: `/api/v1/auth/logout`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "refreshToken": "d8e7f6a5b4c3d2e1f0..."
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout berhasil. Token telah dicabut."
}
```

### Response Body Failed — Token Tidak Ada / Tidak Valid (401 Unauthorized)
```json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Access token tidak ditemukan atau tidak valid"
}
```

---

## 4. Ambil Profil Admin Aktif (Get Current User)

Mengambil data lengkap profil admin yang sedang aktif menggunakan access token.

- **Method**: `GET`
- **Route**: `/api/v1/auth/me`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
```

### Request Body
*None (Kosong)*

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data profil admin berhasil diambil",
  "data": {
    "id": 1,
    "name": "Taufiqur Rohim",
    "email": "admin@penahijau.org",
    "role": "Super Admin",
    "avatar": "/avatars/admin.webp",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2026-08-01T10:30:00.000Z"
  }
}
```

### Response Body Failed — Token Kadaluarsa (401 Unauthorized)
```json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Access token telah kadaluarsa. Silakan perbarui token."
}
```
