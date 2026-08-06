# Buku Panduan AI Agent — Project Pena-Hijau

Dokumen ini adalah **Instruksi Context & Aturan Standar Pengembangan** untuk semua AI Assistant yang bekerja di repositori **Pena-Hijau**. Seluruh petunjuk, batasan arsitektur, dan konvensi koding di bawah ini **WAJIB DIPATUHI TANPA KECUALI**.

---

## 📌 1. Aturan Utama & Peran AI Assistant

1. **Bahasa Komunikasi**: Gunakan Bahasa Indonesia yang ringkas, jelas, profesional, dan langsung pada titik permasalahan.
2. **Jangan Mengira-ngira (No Guessing)**: Selalu periksa file sumber, fungsi, skema database, dan rute API yang relevan sebelum menulis atau mengedit kode.
3. **Verifikasi Wajib Sebelum Menyelesaikan Tugas**:
   - Setelah melakukan perubahan kode, AI WAJIB menjalankan perintah build/check untuk memastikan tidak ada TypeScript error atau broken imports:
     - `pnpm --filter dashboard build`
     - `pnpm --filter frontend build`
     - `pnpm --filter backend build`
4. **Eksekusi Terminal di Windows**: Gunakan sintaks Windows PowerShell atau `cmd /c` jika mengeksekusi script pnpm/shell di lingkungan Windows.
5. **Preservasi Kontrak API & Kode**: Jangan menghapus komentar penting, jangan mengubah kontrak response API tanpa memperbarui seluruh caller site.

---

## 🏗️ 2. Arsitektur Monorepo & Pembagian Port

Proyek ini disusun dalam bentuk **PNPM Workspace Monorepo** dengan pembagian port standar:

| Aplikasi / Package | Path | Teknologi Utama | Port Local |
|---|---|---|---|
| **Backend API** | `apps/backend` | Express.js v5, TypeScript, Drizzle ORM, Multer | **`4000`** (`http://localhost:4000/api/v1`) |
| **Admin Dashboard** | `apps/dashboard` | Next.js 16 (App Router), React 19, Tailwind CSS v4 | **`3000`** (`http://localhost:3000`) |
| **Public Web Frontend** | `apps/frontend` | Next.js 16 (App Router), React 19, Tailwind CSS v4 | **`3001`** (`http://localhost:3001`) |
| **Shared Packages** | `packages/` | Types & Utility shared across apps | Shared |

### Script Utama Monorepo (`package.json` root):
- `pnpm dev` : Menjalankan backend, dashboard, dan frontend secara parallel.
- `pnpm backend` : Menjalankan dev server backend.
- `pnpm dashboard` : Menjalankan dev server dashboard (Port 3000).
- `pnpm frontend` : Menjalankan dev server frontend (Port 3001).
- `pnpm build` : Membangun seluruh aplikasi.

---

## 🛠️ 3. Standar Arsitektur Backend (`apps/backend`)

Backend menggunakan **Layered Modular Architecture** (Controller - Service - Repository):

```
apps/backend/src/
├── config/             # Environment & App configurations
├── db/                 # Drizzle ORM connection & schema definitions
├── middlewares/        # Auth (JWT), Upload (Multer), Error Handler
├── modules/            # Domain modules (Articles, Galleries, Members, Join-Requests, Auth, Uploads)
│   └── {module}/
│       ├── {module}.controller.ts  # Req/Res handler & ResponseUtil caller
│       ├── {module}.service.ts     # Business logic & validation thrower
│       └── {module}.repository.ts  # Database query execution (Drizzle ORM)
├── routes/             # Express Router mounting
└── utils/              # Response utility & helpers
```

### Aturan Koding Backend:
1. **Controller**: Menangani HTTP Request/Response. Mengembalikan response dengan `ResponseUtil.sendSuccess(res, status, message, data)` atau `ResponseUtil.sendError(res, status, message, errors)`.
2. **Service**: Berisi logika bisnis mentah. Throw error berupa object `{ statusCode: number, message: string }`.
3. **Repository**: Melakukan operasi I/O ke database menggunakan Drizzle ORM.
4. **Database & Schema**: Terhubung ke database MySQL/PostgreSQL menggunakan Drizzle ORM (`src/db/schema.ts`).

---

## 🎨 4. Standar Frontend & Admin Dashboard (`apps/dashboard` & `apps/frontend`)

### Dashboard (`apps/dashboard`):
1. **Toast Notification System**:
   - **WAJIB** menggunakan library `nextjs-toast-notify` (`showToast.success`, `showToast.error`, `showToast.info`).
   - **DILARANG** mengimpor `ToastifyContainer` atau file `.css` terpisah karena style diinjeksi secara internal oleh library.
   - **DILARANG** membuat state notification manual (`useState` + `setTimeout` + custom fixed div).
2. **Icon Library**: Gunakan `lucide-react`.
3. **Modal UI & Scroll Locking**:
   - Saat modal terbuka pada komponen dashboard/frontend, `body` scroll HARUS di-lock (`overflow: hidden`) agar layar belakang tidak ikut bergeser.

### Frontend (`apps/frontend`):
1. **Public Integration**: Terhubung ke backend via `frontendApi` di `lib/api.ts`.
2. **Form Validation & User Feedback**: Semua form publik (misal: pendaftaran anggota di `JoinFormSection`) wajib menyediakan umpan balik UI yang jelas dan penanganan error.

---

## 🖼️ 5. Penanganan Upload File & Aturan Rollback Gambar (Issue #6)

Upload gambar menggunakan 2 tahap terpisah (Upload ke Server -> Simpan ke DB). Untuk mencegah timbunan file sampah ketika penyimpanan DB gagal:

1. **Penyimpanan Upload**:
   - Gambar lokal tersimpan di `apps/backend/public/uploads/{subfolder}` (`galleries`, `articles`, `anggota`, `avatars`).
   - Format penamaan file otomatis: `DD-MM-YYYY-basename-shortSuffix.ext`.
2. **Aturan Rollback (Wajib)**:
   - Apabila request upload file sukses, tetapi request simpan data ke Database gagal (di dalam `catch` block pada `GalleryPage`, `ArticlesPage`, `MembersPage`, atau `JoinFormSection`), AI **WAJIB** memanggil endpoint cleanup backend:
     - Endpoint: `DELETE /api/v1/uploads/cleanup`
     - Payload: `{ paths: string[] }` (berisi URL relatif file `/uploads/...` yang baru di-upload).
   - Fungsi helper yang digunakan:
     - Dashboard: `dashboardApi.deleteUploadedFiles(paths)`
     - Frontend: `frontendApi.deleteUploadedFile(path)`

---

## 📁 6. Snapshot Struktur Direktori Proyek

```
├── 📁 apps
│   ├── 📁 backend
│   │   ├── 📁 doc
│   │   │   ├── 📝 articles.md
│   │   │   ├── 📝 auth.md
│   │   │   ├── 📝 galleries.md
│   │   │   ├── 📝 join-requests.md
│   │   │   └── 📝 members.md
│   │   ├── 📁 public
│   │   │   └── 📁 uploads
│   │   │       ├── 📁 anggota
│   │   │       ├── 📁 articles
│   │   │       └── 📁 galleries
│   │   ├── 📁 src
│   │   │   ├── 📁 config
│   │   │   ├── 📁 db
│   │   │   ├── 📁 middlewares
│   │   │   ├── 📁 modules
│   │   │   │   ├── 📁 articles
│   │   │   │   ├── 📁 auth
│   │   │   │   ├── 📁 galleries
│   │   │   │   ├── 📁 join-requests
│   │   │   │   ├── 📁 members
│   │   │   │   └── 📁 uploads
│   │   │   ├── 📁 routes
│   │   │   ├── 📁 scripts
│   │   │   └── 📁 utils
│   │   ├── 📄 drizzle.config.ts
│   │   ├── ⚙️ package.json
│   │   └── ⚙️ tsconfig.json
│   ├── 📁 dashboard
│   │   ├── 📁 app
│   │   ├── 📁 components
│   │   │   ├── 📁 layouts
│   │   │   └── 📁 pages
│   │   ├── 📁 lib
│   │   │   └── 📄 api.ts
│   │   ├── 📁 public
│   │   ├── ⚙️ package.json
│   │   └── ⚙️ tsconfig.json
│   └── 📁 frontend
│       ├── 📁 app
│       ├── 📁 components
│       │   ├── 📁 layouts
│       │   └── 📁 pages
│       ├── 📁 lib
│       │   └── 📄 api.ts
│       ├── 📁 public
│       ├── ⚙️ package.json
│       └── ⚙️ tsconfig.json
├── 📁 packages
│   ├── 📁 types
│   └── 📁 utils
├── 📝 AGENTS.md
├── ⚙️ package.json
├── ⚙️ pnpm-lock.yaml
└── ⚙️ pnpm-workspace.yaml
```

---
*Catatan: Setiap AI yang berinteraksi dengan repositori ini wajib membaca dan menaati isi dokumen ini agar konsistensi kode dan arsitektur Pena-Hijau tetap terjaga.*