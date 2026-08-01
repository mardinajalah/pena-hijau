# API Specification — Volunteer Members Management (`members.md`)

Dokumentasi spesifikasi API dan kontrak data untuk pengelolaan data anggota relawan komunitas Pena Hijau.

---

## Base URL
```
http://localhost:5000/api/v1/members
```

---

## Daftar Endpoint

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/` | Ambil daftar semua anggota relawan (search, filter divisi/status, pagination) | Public / Protected |
| `GET` | `/:id` | Ambil detail data 1 anggota relawan | Public / Protected |
| `POST` | `/` | Tambah anggota relawan baru secara manual | Protected (Admin JWT) |
| `PUT` | `/:id` | Perbarui data lengkap anggota relawan | Protected (Admin JWT) |
| `PATCH` | `/:id/status` | Ubah status anggota (Aktif / Nonaktif) | Protected (Admin JWT) |
| `DELETE` | `/:id` | Hapus data anggota relawan | Protected (Admin JWT) |

---

## 1. Ambil Daftar Anggota Relawan (Get All Members)

Mengambil daftar relawan untuk ditampilkan pada direktori website (`apps/frontend/members`) maupun tabel dashboard admin (`apps/dashboard/members`).

- **Method**: `GET`
- **Route**: `/api/v1/members`
- **Akses**: Public / Protected

### Query Parameters (Opsional)
- `search` (string): Pencarian berdasarkan nama, domisili, atau divisi
- `division` (string): Filter divisi (misal: `Koordinator Lapangan & Clean-Up`, `Tim Edukasi & Bank Sampah`, `Penghijauan & Bibit Pohon`, `Media & Kampanye Digital`, `Logistik & Operasional`)
- `status` (string): Filter status (`Aktif`, `Nonaktif`)
- `page` (number): Halaman pagination (default: `1`)
- `limit` (number): Jumlah item per halaman (default: `10`)

### Request Headers
```http
Content-Type: application/json
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Berhasil mengambil daftar anggota relawan",
  "data": [
    {
      "id": 1,
      "name": "Ahmad Hidayat, S.P.",
      "address": "Jl. Melati No. 12, Desa Kotaanyar",
      "domicile": "Probolinggo, Jawa Timur",
      "division": "Koordinator Lapangan & Clean-Up",
      "whatsapp": "082233441122",
      "motto": "Alam yang sehat adalah warisan terbaik untuk generasi mendatang.",
      "status": "Aktif",
      "joinDate": "2024-03-12T00:00:00.000Z",
      "avatar": "/avatars/member-1.webp",
      "createdAt": "2024-03-12T10:00:00.000Z",
      "updatedAt": "2026-08-01T08:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Siti Nurhaliza",
      "address": "Jl. Anggrek No. 5, Kec. Kraksaan",
      "domicile": "Probolinggo, Jawa Timur",
      "division": "Tim Edukasi & Bank Sampah",
      "whatsapp": "085678901234",
      "motto": "Edukasi adalah kunci perubahan lingkungan yang berkelanjutan.",
      "status": "Aktif",
      "joinDate": "2024-06-28T00:00:00.000Z",
      "avatar": "/avatars/member-2.webp",
      "createdAt": "2024-06-28T10:00:00.000Z",
      "updatedAt": "2026-08-01T08:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "summary": {
    "totalMembers": 48,
    "activeCount": 45,
    "inactiveCount": 3
  }
}
```

---

## 2. Ambil Detail 1 Anggota (Get Member by ID)

- **Method**: `GET`
- **Route**: `/api/v1/members/:id`
- **Akses**: Public / Protected

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Detail anggota berhasil ditemukan",
  "data": {
    "id": 1,
    "name": "Ahmad Hidayat, S.P.",
    "address": "Jl. Melati No. 12, Desa Kotaanyar",
    "domicile": "Probolinggo, Jawa Timur",
    "division": "Koordinator Lapangan & Clean-Up",
    "whatsapp": "082233441122",
    "motto": "Alam yang sehat adalah warisan terbaik untuk generasi mendatang.",
    "status": "Aktif",
    "joinDate": "2024-03-12T00:00:00.000Z",
    "avatar": "/avatars/member-1.webp",
    "createdAt": "2024-03-12T10:00:00.000Z"
  }
}
```

### Response Body Failed — Data Tidak Ditemukan (404 Not Found)
```json
{
  "success": false,
  "statusCode": 404,
  "error": "Not Found",
  "message": "Data anggota relawan dengan ID tersebut tidak ditemukan"
}
```

---

## 3. Tambah Anggota Relawan Baru (Create Member)

Menambahkan data anggota relawan secara langsung melalui dashboard admin.

- **Method**: `POST`
- **Route**: `/api/v1/members`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "name": "Fajar Nugroho",
  "address": "Jl. Cemara No. 9, Kec. Kraksaan",
  "domicile": "Probolinggo, Jawa Timur",
  "division": "Logistik & Operasional",
  "whatsapp": "087788990011",
  "motto": "Di balik setiap aksi besar, ada tim logistik yang bekerja keras.",
  "status": "Aktif"
}
```

### Response Body Success (201 Created)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Anggota relawan baru berhasil ditambahkan",
  "data": {
    "id": 49,
    "name": "Fajar Nugroho",
    "address": "Jl. Cemara No. 9, Kec. Kraksaan",
    "domicile": "Probolinggo, Jawa Timur",
    "division": "Logistik & Operasional",
    "whatsapp": "087788990011",
    "motto": "Di balik setiap aksi besar, ada tim logistik yang bekerja keras.",
    "status": "Aktif",
    "joinDate": "2026-08-01T12:00:00.000Z",
    "avatar": "/avatars/default.webp",
    "createdAt": "2026-08-01T12:00:00.000Z"
  }
}
```

### Response Body Failed — Validasi Gagal (400 Bad Request)
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validasi input gagal",
  "details": [
    {
      "field": "name",
      "message": "Nama anggota wajib diisi"
    },
    {
      "field": "division",
      "message": "Divisi tidak sesuai dengan daftar divisi resmi"
    }
  ]
}
```

---

## 4. Perbarui Data Anggota (Update Member)

- **Method**: `PUT`
- **Route**: `/api/v1/members/:id`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "name": "Ahmad Hidayat, S.P., M.Si.",
  "address": "Jl. Melati No. 15, Desa Kotaanyar",
  "domicile": "Probolinggo, Jawa Timur",
  "division": "Koordinator Lapangan & Clean-Up",
  "whatsapp": "082233441122",
  "motto": "Alam sehat untuk generasi mendatang.",
  "status": "Aktif"
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data anggota relawan berhasil diperbarui",
  "data": {
    "id": 1,
    "name": "Ahmad Hidayat, S.P., M.Si.",
    "address": "Jl. Melati No. 15, Desa Kotaanyar",
    "domicile": "Probolinggo, Jawa Timur",
    "division": "Koordinator Lapangan & Clean-Up",
    "whatsapp": "082233441122",
    "motto": "Alam sehat untuk generasi mendatang.",
    "status": "Aktif",
    "updatedAt": "2026-08-01T12:05:00.000Z"
  }
}
```

---

## 5. Ubah Status Anggota (Toggle Status)

Mengubah status keanggotaan menjadi `Aktif` atau `Nonaktif`.

- **Method**: `PATCH`
- **Route**: `/api/v1/members/:id/status`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "status": "Nonaktif"
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Status anggota relawan berhasil diubah menjadi Nonaktif",
  "data": {
    "id": 1,
    "name": "Ahmad Hidayat, S.P.",
    "status": "Nonaktif",
    "updatedAt": "2026-08-01T12:10:00.000Z"
  }
}
```

---

## 6. Hapus Data Anggota (Delete Member)

- **Method**: `DELETE`
- **Route**: `/api/v1/members/:id`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data anggota relawan berhasil dihapus"
}
```
