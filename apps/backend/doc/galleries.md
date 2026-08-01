# API Specification — Event Gallery & Photos Management (`galleries.md`)

Dokumentasi spesifikasi API dan kontrak data untuk dokumentasi foto kegiatan aksi lapangan komunitas Pena Hijau (`apps/frontend/gallery` dan `apps/dashboard/gallery`).

---

## Base URL
```
http://localhost:5000/api/v1/galleries
```

---

## Daftar Endpoint

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/` | Ambil daftar semua event galeri kegiatan (dengan pagination & filter kategori) | Public / Protected |
| `GET` | `/:id` | Ambil detail 1 event galeri beserta seluruh daftar foto dokumentasinya | Public / Protected |
| `POST` | `/` | Buat event galeri baru | Protected (Admin JWT) |
| `PUT` | `/:id` | Perbarui data informasi event galeri | Protected (Admin JWT) |
| `POST` | `/:id/photos` | Upload/tambah foto dokumentasi baru ke suatu event | Protected (Admin JWT) |
| `DELETE` | `/:id/photos/:photoId` | Hapus 1 foto dokumentasi dari event | Protected (Admin JWT) |
| `DELETE` | `/:id` | Hapus seluruh event galeri beserta foto-fotonya | Protected (Admin JWT) |

---

## 1. Ambil Daftar Event Galeri (Get All Galleries)

Mengambil daftar event kegiatan yang berisi cover thumbnail, jumlah foto, lokasi, dan tanggal pelaksanaan.

- **Method**: `GET`
- **Route**: `/api/v1/galleries`
- **Akses**: Public / Protected

### Query Parameters (Opsional)
- `category` (string): Filter kategori (`Aksi Clean-Up`, `Penghijauan`, `Edukasi`, `Komunitas`)
- `search` (string): Pencarian judul event atau nama desa
- `page` (number): Halaman (default: `1`)
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
  "message": "Berhasil mengambil daftar event galeri",
  "data": [
    {
      "id": 1,
      "title": "Aksi Bersih Sampah Aliran Sungai Kotaanyar",
      "category": "Aksi Clean-Up",
      "location": "Desa Kotaanyar, Probolinggo",
      "date": "27 Juli 2026",
      "coverImage": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp",
      "photoCount": 7,
      "description": "Relawan Pena Hijau bersama warga bergotong-royong membersihkan limbah plastik di jembatan sungai Kotaanyar.",
      "createdAt": "2026-07-27T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Penanaman 500 Bibit Pohon Produktif",
      "category": "Penghijauan",
      "location": "Kecamatan Paiton, Probolinggo",
      "date": "15 Juli 2026",
      "coverImage": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp",
      "photoCount": 2,
      "description": "Aksi hijau menanam bibit pohon buah dan lindung di kawasan lereng kritis desa mitra.",
      "createdAt": "2026-07-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 26,
    "itemsPerPage": 10
  },
  "summary": {
    "totalEvents": 26,
    "totalPhotos": 184,
    "totalVillages": 25
  }
}
```

---

## 2. Ambil Detail Event & Seluruh Foto (Get Gallery Detail)

Mengambil detail 1 event beserta array URL foto dokumentasi lengkap untuk ditampilkan pada lightbox viewer frontend maupun dashboard admin.

- **Method**: `GET`
- **Route**: `/api/v1/galleries/:id`
- **Akses**: Public / Protected

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Detail event galeri berhasil ditemukan",
  "data": {
    "id": 1,
    "title": "Aksi Bersih Sampah Aliran Sungai Kotaanyar",
    "category": "Aksi Clean-Up",
    "location": "Desa Kotaanyar, Probolinggo",
    "date": "27 Juli 2026",
    "coverImage": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp",
    "description": "Relawan Pena Hijau bersama warga bergotong-royong membersihkan limbah plastik di jembatan sungai Kotaanyar.",
    "photos": [
      { "id": 101, "url": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp", "caption": "Persiapan tim relawan di tepi sungai" },
      { "id": 102, "url": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp", "caption": "Pembersihan material sampah plastik" },
      { "id": 103, "url": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp", "caption": "Pengangkutan sampah ke truk angkut" },
      { "id": 104, "url": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp", "caption": "Gotong royong relawan muda di bawah jembatan" },
      { "id": 105, "url": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp", "caption": "Kondisi aliran air sungai setelah dibersihkan" },
      { "id": 106, "url": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp", "caption": "Foto bersama relawan Pena Hijau" },
      { "id": 107, "url": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp", "caption": "Edukasi singkat kepada warga sekitar" }
    ],
    "createdAt": "2026-07-27T10:00:00.000Z"
  }
}
```

---

## 3. Tambah Event Galeri Baru (Create Event)

- **Method**: `POST`
- **Route**: `/api/v1/galleries`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "title": "Penanaman 1.000 Pohon Mangrove Pesisir",
  "category": "Penghijauan",
  "location": "Desa Pesisir Hijau, Situbondo",
  "date": "01 Agustus 2026",
  "description": "Aksi penanaman bibit mangrove untuk mencegah abrasi pantai pesisir."
}
```

### Response Body Success (201 Created)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Event galeri baru berhasil dibuat",
  "data": {
    "id": 27,
    "title": "Penanaman 1.000 Pohon Mangrove Pesisir",
    "category": "Penghijauan",
    "location": "Desa Pesisir Hijau, Situbondo",
    "date": "01 Agustus 2026",
    "description": "Aksi penanaman bibit mangrove untuk mencegah abrasi pantai pesisir.",
    "coverImage": "/gallery/default-cover.webp",
    "photos": [],
    "createdAt": "2026-08-01T12:00:00.000Z"
  }
}
```

---

## 4. Upload Foto Dokumentasi ke Event (Upload Photos)

Mengunggah file foto ke event galeri yang sudah ada.

- **Method**: `POST`
- **Route**: `/api/v1/galleries/:id/photos`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

### Request Form-Data
- `photos`: (File Binary / Array of Files, format WebP/JPG/PNG, max 5MB/file)
- `caption`: (opsional string)

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "3 foto berhasil diunggah ke event galeri",
  "data": {
    "eventId": 27,
    "uploadedPhotos": [
      { "id": 201, "url": "/uploads/gallery/mangrove-1.webp" },
      { "id": 202, "url": "/uploads/gallery/mangrove-2.webp" },
      { "id": 203, "url": "/uploads/gallery/mangrove-3.webp" }
    ]
  }
}
```

---

## 5. Hapus Foto dari Event (Delete Photo)

- **Method**: `DELETE`
- **Route**: `/api/v1/galleries/:id/photos/:photoId`
- **Akses**: Protected (Admin JWT)

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Foto dokumentasi berhasil dihapus"
}
```

---

## 6. Hapus Seluruh Event Galeri (Delete Event)

- **Method**: `DELETE`
- **Route**: `/api/v1/galleries/:id`
- **Akses**: Protected (Admin JWT)

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Event galeri beserta seluruh foto di dalamnya berhasil dihapus"
}
```
