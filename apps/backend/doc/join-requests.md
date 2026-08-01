# API Specification — Online Join Requests (`join-requests.md`)

Dokumentasi spesifikasi API dan kontrak data untuk formulir pendaftaran relawan online publik (`apps/frontend/join`) dan proses verifikasi admin dashboard (`apps/dashboard/join-requests`).

---

## Base URL
```
http://localhost:5000/api/v1/join-requests
```

---

## Daftar Endpoint

| Method | Route | Deskripsi | Akses |
|---|---|---|---|
| `POST` | `/` | Mengirim formulir pendaftaran relawan baru | Public (Frontend) |
| `GET` | `/` | Ambil semua daftar permintaan pendaftaran (filter status `Menunggu`, `Diterima`, `Ditolak`) | Protected (Admin JWT) |
| `GET` | `/:id` | Ambil detail 1 formulir pendaftaran | Protected (Admin JWT) |
| `PATCH` | `/:id/verify` | Verifikasi pendaftaran (`Diterima` atau `Ditolak`) | Protected (Admin JWT) |

---

## 1. Kirim Formulir Pendaftaran (Submit Join Form)

Menerima pendaftaran calon relawan baru dari formulir online website (`apps/frontend/app/join/page.tsx`). Secara otomatis menetapkan status awal pendaftaran menjadi `Menunggu`.

- **Method**: `POST`
- **Route**: `/api/v1/join-requests`
- **Akses**: Public (Frontend Website)

### Request Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "name": "Rizky Firmansyah",
  "address": "Jl. Merpati No. 4, Kec. Kotaanyar",
  "domicile": "Probolinggo, Jawa Timur",
  "divisionInterest": "Koordinator Lapangan & Clean-Up",
  "whatsapp": "082211223344",
  "motto": "Sungai bersih dimulai dari tangan kita sendiri."
}
```

### Response Body Success (201 Created)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Pendaftaran relawan berhasil dikirim! Tim kami akan meninjau pendaftaran Anda.",
  "data": {
    "requestId": 105,
    "name": "Rizky Firmansyah",
    "divisionInterest": "Koordinator Lapangan & Clean-Up",
    "status": "Menunggu",
    "registeredDate": "2026-08-01T12:00:00.000Z",
    "memberCardPreview": {
      "cardId": "PH-2026-0105",
      "qrCodeUrl": "/qr/PH-2026-0105.png"
    }
  }
}
```

### Response Body Failed — Validasi Input Gagal (400 Bad Request)
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validasi formulir pendaftaran gagal",
  "details": [
    {
      "field": "name",
      "message": "Nama lengkap wajib diisi"
    },
    {
      "field": "whatsapp",
      "message": "Nomor WhatsApp tidak valid"
    }
  ]
}
```

---

## 2. Ambil Semua Permintaan Pendaftaran (Get All Join Requests)

Mengambil daftar pendaftar relawan untuk ditinjau pada panel dashboard admin (`apps/dashboard/join-requests`).

- **Method**: `GET`
- **Route**: `/api/v1/join-requests`
- **Akses**: Protected (Admin JWT)

### Query Parameters (Opsional)
- `status` (string): Filter status (`Menunggu`, `Diterima`, `Ditolak`)
- `search` (string): Pencarian nama, domisili, atau divisi
- `page` (number): Halaman pagination (default: `1`)
- `limit` (number): Jumlah item per halaman (default: `10`)

### Request Headers
```http
Authorization: Bearer <accessToken>
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Berhasil mengambil daftar pendaftaran relawan",
  "data": [
    {
      "id": 1,
      "name": "Rizky Firmansyah",
      "address": "Jl. Merpati No. 4, Kec. Kotaanyar",
      "domicile": "Probolinggo, Jawa Timur",
      "divisionInterest": "Koordinator Lapangan & Clean-Up",
      "whatsapp": "082211223344",
      "motto": "Sungai bersih dimulai dari tangan kita sendiri.",
      "registeredDate": "2026-08-01T00:00:00.000Z",
      "status": "Menunggu",
      "createdAt": "2026-08-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Nur Aini Rahayu",
      "address": "Jl. Bougenville No. 8, Kec. Kraksaan",
      "domicile": "Probolinggo, Jawa Timur",
      "divisionInterest": "Tim Edukasi & Bank Sampah",
      "whatsapp": "085599887766",
      "motto": "Ilmu tanpa aksi adalah sia-sia.",
      "registeredDate": "2026-07-31T00:00:00.000Z",
      "status": "Diterima",
      "createdAt": "2026-07-31T15:00:00.000Z"
    }
  ],
  "summary": {
    "total": 15,
    "waiting": 5,
    "accepted": 8,
    "rejected": 2
  }
}
```

---

## 3. Ambil Detail Pendaftar (Get Request Detail)

- **Method**: `GET`
- **Route**: `/api/v1/join-requests/:id`
- **Akses**: Protected (Admin JWT)

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Detail pendaftar berhasil ditemukan",
  "data": {
    "id": 1,
    "name": "Rizky Firmansyah",
    "address": "Jl. Merpati No. 4, Kec. Kotaanyar",
    "domicile": "Probolinggo, Jawa Timur",
    "divisionInterest": "Koordinator Lapangan & Clean-Up",
    "whatsapp": "082211223344",
    "motto": "Sungai bersih dimulai dari tangan kita sendiri.",
    "registeredDate": "2026-08-01T00:00:00.000Z",
    "status": "Menunggu"
  }
}
```

---

## 4. Verifikasi Terima / Tolak Pendaftar (Verify Request)

Administrator memverifikasi pendaftaran menjadi `Diterima` atau `Ditolak`.

> **Logika Bisnis Khusus**:
> Jika status diubah menjadi **`Diterima`**, backend secara otomatis akan menyalin data pendaftar ini ke tabel utama **`members`** sebagai anggota aktif resmi.

- **Method**: `PATCH`
- **Route**: `/api/v1/join-requests/:id/verify`
- **Akses**: Protected (Admin JWT)

### Request Headers
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body — Contoh Menerima Pendaftar
```json
{
  "status": "Diterima",
  "adminNote": "Data lengkap, memenuhi kualifikasi relawan lapangan."
}
```

### Request Body — Contoh Menolak Pendaftar
```json
{
  "status": "Ditolak",
  "adminNote": "Domisili di luar jangkauan area operasional."
}
```

### Response Body Success (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pendaftaran berhasil DITERIMA. Pendaftar telah otomatis terdaftar sebagai anggota resmi Pena Hijau.",
  "data": {
    "requestId": 1,
    "name": "Rizky Firmansyah",
    "status": "Diterima",
    "newMemberId": 50,
    "verifiedAt": "2026-08-01T12:10:00.000Z"
  }
}
```
