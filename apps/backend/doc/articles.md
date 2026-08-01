# API Specification — Articles & Pillar Content (`articles.md`)

Dokumentasi spesifikasi API dan kontrak data untuk artikel berita, laporan aksi lapangan, dan pilar gerakan komunitas Pena Hijau (`apps/frontend/about` - `AboutPillars` dan `apps/dashboard/articles`).

---

## Base URL
```
http://localhost:4000/api/v1/articles
```

---

## Daftar Endpoint

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/` | Ambil daftar semua artikel (dengan filter kategori pilar & status publikasi) | Public / Protected |
| `GET` | `/:id` | Ambil detail 1 artikel lengkap (beserta paragraf, foto galeri, quote, & sumber media) | Public / Protected |
| `POST` | `/` | Tulis artikel baru (default status `Draft`) | Protected (Admin JWT) |
| `PUT` | `/:id` | Perbarui isi artikel | Protected (Admin JWT) |
| `PATCH` | `/:id/publish` | Ubah status publikasi artikel (`Dipublikasikan` / `Draft`) | Protected (Admin JWT) |
| `DELETE` | `/:id` | Hapus artikel | Protected (Admin JWT) |

---

## 1. Ambil Daftar Artikel (Get All Articles)

Mengambil daftar artikel untuk konsumsi publik website frontend (hanya yang berstatus `Dipublikasikan`) maupun tabel pengelolaan dashboard admin (semua status).

- **Method**: `GET`
- **Route**: `/api/v1/articles`
- **Akses**: Public / Protected

### Query Parameters (Opsional)
- `category` (string): Filter kategori pilar (`Aksi Clean-Up`, `Penghijauan`, `Edukasi`, `Komunitas`)
- `status` (string): Filter status publikasi (`Dipublikasikan`, `Draft`) — *Public endpoint otomatis hanya mengembalikan `Dipublikasikan`*
- `search` (string): Pencarian kata kunci pada judul, penulis, atau lokasi
- `page` (number): Halaman (default: `1`)
- `limit` (number): Jumlah per halaman (default: `10`)

### Request Headers
```http
Content-Type: application/json
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Berhasil mengambil daftar artikel",
  "data": [
    {
      "id": 1,
      "title": "Peduli Lingkungan, Komunitas PENA HIJAU Gelar Aksi Clean Up River di Kotaanyar Probolinggo",
      "category": "Aksi Clean-Up",
      "date": "27 Juli 2026",
      "location": "Kecamatan Kotaanyar, Kabupaten Probolinggo",
      "author": "Taufiqur Rohim",
      "excerpt": "Kelompok pemuda Komunitas PENA HIJAU menggelar aksi bersih-bersih sungai di Kotaanyar Probolinggo sebagai langkah konkrit mencegah pencemaran dan bencana banjir.",
      "image": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp",
      "sources": [
        { "name": "Berdampak.net", "url": "https://berdampak.net/peduli-lingkungan-komunitas-pena-hijau-gelar-aksi-clean-up-river-di-kotaanyar-probolinggo/" },
        { "name": "HarianJatim.com", "url": "https://www.harianjatim.com/2026/07/27/aksi-nyata-komunitas-pena-hijau-bersihkan-tumpukan-sampah-di-sungai-kotaanyar-probolinggo/" }
      ],
      "status": "Dipublikasikan",
      "createdAt": "2026-07-27T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Tanam 500 Bibit Pohon Produktif, Pena Hijau Hijaukan Lereng Desa Paiton",
      "category": "Penghijauan",
      "date": "15 Juli 2026",
      "location": "Kecamatan Paiton, Kabupaten Probolinggo",
      "author": "Budi Santoso",
      "excerpt": "Relawan Pena Hijau bersama petani desa menanam 500 bibit pohon buah dan pohon lindung.",
      "image": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp",
      "sources": [],
      "status": "Dipublikasikan",
      "createdAt": "2026-07-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 8,
    "itemsPerPage": 10
  },
  "summary": {
    "totalArticles": 8,
    "publishedCount": 7,
    "draftCount": 1
  }
}
```

---

## 2. Ambil Detail Artikel Lengkap (Get Article Detail)

Mengambil struktur artikel penuh beserta array paragraf isi, foto pendukung galeri, quote highlight, dan tautan berita media partner.

- **Method**: `GET`
- **Route**: `/api/v1/articles/:id`
- **Akses**: Public / Protected

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Detail artikel berhasil ditemukan",
  "data": {
    "id": 1,
    "title": "Peduli Lingkungan, Komunitas PENA HIJAU Gelar Aksi Clean Up River di Kotaanyar Probolinggo",
    "category": "Aksi Clean-Up",
    "date": "27 Juli 2026",
    "location": "Kecamatan Kotaanyar, Kabupaten Probolinggo",
    "author": "Taufiqur Rohim (Koordinator PENA HIJAU)",
    "excerpt": "Kelompok pemuda Komunitas PENA HIJAU menggelar aksi bersih-bersih sungai di Kotaanyar Probolinggo sebagai langkah konkrit mencegah pencemaran dan bencana banjir.",
    "paragraphs": [
      "PROBOLINGGO — Kelompok pemuda yang tergabung dalam Komunitas Pemuda Nusantara Peduli Lingkungan Hijau (PENA HIJAU) menggelar aksi clean up river (bersih-bersih sungai) di wilayah Kecamatan Kotaanyar, Kabupaten Probolinggo, Senin sore (27/07/2026).",
      "Aksi tanggap lingkungan ini dilakukan sebagai bentuk kepedulian nyata para generasi muda terhadap kondisi sungai yang kian tertutup tumpukan sampah plastik, limbah rumah tangga, dan kotoran liar yang mengganggu kelancaran aliran air.",
      "Dengan menggunakan peralatan lengkap seperti karung sampah, sepatu boots, dan sarung tangan, para relawan muda Pena Hijau secara langsung menyusuri dan mengangkat berbagai material sampah dari dasar serta pinggiran sungai.",
      "Langkah ini diharapkan tidak hanya dapat mengembalikan kebersihan dan kelancaran fungsi aliran sungai Kotaanyar, melainkan juga mengedukasi dan menggugah kesadaran masyarakat sekitar agar menghentikan kebiasaan membuang sampah sembarangan ke sungai."
    ],
    "quote": "Kami melihat tumpukan sampah di aliran sungai ini sudah sangat mengkhawatirkan. Jika dibiarkan, saat musim hujan bisa memicu banjir dan pencemaran air. Oleh karena itu, kami bersama teman-teman relawan tergerak untuk turun langsung bersihkan sungai.",
    "image": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp",
    "galleryImages": [
      "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp",
      "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp",
      "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp",
      "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp",
      "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp",
      "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp",
      "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp"
    ],
    "sources": [
      {
        "name": "Berdampak.net",
        "url": "https://berdampak.net/peduli-lingkungan-komunitas-pena-hijau-gelar-aksi-clean-up-river-di-kotaanyar-probolinggo/"
      },
      {
        "name": "HarianJatim.com",
        "url": "https://www.harianjatim.com/2026/07/27/aksi-nyata-komunitas-pena-hijau-bersihkan-tumpukan-sampah-di-sungai-kotaanyar-probolinggo/"
      }
    ],
    "status": "Dipublikasikan",
    "createdAt": "2026-07-27T10:00:00.000Z",
    "updatedAt": "2026-07-27T10:00:00.000Z"
  }
}
```

---

## 3. Tulis Artikel Baru (Create Article)

Membuat draf artikel baru dari dashboard admin. Secara bawaan berstatus `Draft`.

- **Method**: `POST`
- **Route**: `/api/v1/articles`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "title": "Sosialisasi Pemilahan Sampah Mandiri di Desa Pesisir Hijau Situbondo",
  "category": "Edukasi",
  "date": "02 Juli 2026",
  "location": "Desa Pesisir Hijau, Kabupaten Situbondo",
  "author": "Siti Nurhaliza",
  "excerpt": "Tim edukasi Pena Hijau melakukan sosialisasi pemilahan sampah anorganik bagi warga dan generasi muda pesisir.",
  "paragraphs": [
    "SITUBONDO — Tim edukasi Komunitas Pena Hijau menggelar sosialisasi pengelolaan dan pemilahan sampah mandiri di Desa Pesisir Hijau, Kabupaten Situbondo.",
    "Kegiatan ini disambut antusias oleh warga, terutama kelompok ibu rumah tangga dan generasi muda pesisir."
  ],
  "quote": "Edukasi lingkungan paling efektif dimulai dari kebiasaan kecil di dapur rumah tangga.",
  "image": "/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp",
  "sources": [
    {
      "name": "Media Lokal Situbondo",
      "url": "https://medialokal.example.com/edukasi-pena-hijau"
    }
  ]
}
```

### Response Body Success (201 Created)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Artikel baru berhasil disimpan sebagai Draft",
  "data": {
    "id": 9,
    "title": "Sosialisasi Pemilahan Sampah Mandiri di Desa Pesisir Hijau Situbondo",
    "category": "Edukasi",
    "status": "Draft",
    "createdAt": "2026-08-01T12:00:00.000Z"
  }
}
```

---

## 4. Perbarui Artikel (Update Article)

- **Method**: `PUT`
- **Route**: `/api/v1/articles/:id`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "title": "Sosialisasi Pemilahan Sampah Mandiri di Desa Pesisir Hijau Situbondo (Update)",
  "category": "Edukasi",
  "date": "02 Juli 2026",
  "location": "Desa Pesisir Hijau, Situbondo",
  "author": "Siti Nurhaliza",
  "excerpt": "Tim edukasi Pena Hijau melakukan sosialisasi pemilahan sampah anorganik.",
  "paragraphs": [
    "SITUBONDO — Tim edukasi Komunitas Pena Hijau menggelar sosialisasi..."
  ],
  "sources": [
    {
      "name": "Media Lokal Situbondo",
      "url": "https://medialokal.example.com/edukasi-pena-hijau"
    }
  ]
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Artikel berhasil diperbarui",
  "data": {
    "id": 9,
    "title": "Sosialisasi Pemilahan Sampah Mandiri di Desa Pesisir Hijau Situbondo (Update)",
    "updatedAt": "2026-08-01T12:15:00.000Z"
  }
}
```

---

## 5. Ubah Status Publikasi Artikel (Publish / Draft Toggle)

- **Method**: `PATCH`
- **Route**: `/api/v1/articles/:id/publish`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "status": "Dipublikasikan"
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Artikel berhasil dipublikasikan ke website utama",
  "data": {
    "id": 9,
    "title": "Sosialisasi Pemilahan Sampah Mandiri di Desa Pesisir Hijau Situbondo",
    "status": "Dipublikasikan",
    "updatedAt": "2026-08-01T12:20:00.000Z"
  }
}
```

---

## 6. Hapus Artikel (Delete Article)

- **Method**: `DELETE`
- **Route**: `/api/v1/articles/:id`
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
  "message": "Artikel berhasil dihapus"
}
```
