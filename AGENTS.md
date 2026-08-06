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

## 🧠 2. Penggunaan Agent Skills (`.agents/skills/`)

Repositori ini dilengkapi dengan **Agent Skills** otomatis di direktori `.agents/skills/`. Sistem AI secara otomatis menemukan dan memuat skill ini sebagai panduan teknis mendalam.

### Aturan Penggunaan Skill untuk AI:
- Sebelum mengeksekusi pekerjaan spesifik, AI **WAJIB** membaca file `SKILL.md` terkait menggunakan `view_file` pada folder `.agents/skills/<skill-name>/SKILL.md`.
- AI harus menerapkan standar, *best practices*, dan pola arsitektur yang tertera pada dokumen skill terkait.

### Daftar Skill Terpasang:
| Nama Skill | Lokasi (`.agents/skills/`) | Kegunaan Utama |
|---|---|---|
| **`frontend-design`** | `frontend-design/SKILL.md` | Standar desain UI modern, visual excellence, & komponen web |
| **`tailwind-css-patterns`** | `tailwind-css-patterns/SKILL.md` | Pola styling Tailwind CSS v4, responsive layout, & utility |
| **`next-best-practices`** | `next-best-practices/SKILL.md` | Praktik terbaik Next.js 16 (App Router, RSC boundary, metadata) |
| **`next-cache-components`** | `next-cache-components/SKILL.md` | Next.js PPR & directive caching (`use cache`, `cacheTag`) |
| **`react-best-practices`** | `react-best-practices/SKILL.md` | Optimasi performa React 19 & Next.js dari Vercel Engineering |
| **`composition-patterns`** | `composition-patterns/SKILL.md` | Pola komposisi komponen React yang fleksibel & reusable |
| **`nodejs-backend-patterns`** | `nodejs-backend-patterns/SKILL.md` | Arsitektur backend Node.js, middleware, & API design |
| **`nodejs-express-server`** | `nodejs-express-server/SKILL.md` | Panduan Express.js server, middleware chain, & REST API |
| **`nodejs-best-practices`** | `nodejs-best-practices/SKILL.md` | Prinsip pengembangan Node.js, async patterns, & keamanan |
| **`typescript-advanced-types`**| `typescript-advanced-types/SKILL.md` | Type safety, generics, conditional & utility types |
| **`seo`** | `seo/SKILL.md` | Optimasi SEO, meta tags, semantic HTML, & sitemap |
| **`accessibility`** | `accessibility/SKILL.md` | Audit & pemenuhan standar WCAG 2.2 accessibility (a11y) |
| **`next-upgrade`** | `next-upgrade/SKILL.md` | Panduan migrasi & upgrade Next.js |

---

## 🏗️ 3. Arsitektur Monorepo & Pembagian Port

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

## 🛠️ 4. Standar Arsitektur Backend (`apps/backend`)

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

## 🎨 5. Standar Frontend & Admin Dashboard (`apps/dashboard` & `apps/frontend`)

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

## 🖼️ 6. Penanganan Upload File & Aturan Rollback Gambar (Issue #6)

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

## 📁 7. Snapshot Struktur Direktori Proyek

```
├── 📁 .agents
│   └── 📁 skills/              # 13 Agent Skills (Autoskills)
├── 📁 apps
│   ├── 📁 backend
│   │   ├── 📁 doc
│   │   ├── 📁 public/uploads
│   │   ├── 📁 src
│   │   ├── 📄 drizzle.config.ts
│   │   ├── ⚙️ package.json
│   │   └── ⚙️ tsconfig.json
│   ├── 📁 dashboard
│   │   ├── 📁 app
│   │   ├── 📁 components
│   │   ├── 📁 lib
│   │   ├── ⚙️ package.json
│   │   └── ⚙️ tsconfig.json
│   └── 📁 frontend
│       ├── 📁 app
│       ├── 📁 components
│       ├── 📁 lib
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