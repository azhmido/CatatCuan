# CatatCuan — Invoicing & Billing Management System

> **Proyek Akhir Pelatihan React dan Java Spring Boot**  
> Aplikasi full-stack pencatatan faktur, penagihan, dan manajemen piutang usaha yang dibangun menggunakan **Java Spring Boot 3** (Backend REST API) dan **React 19 + Vite** (Frontend SPA) dengan package manager **pnpm**.  
>  
> 🌐 **Live Demo (Production)**: [https://catatcuan-by-azhmido.vercel.app](https://catatcuan-by-azhmido.vercel.app)  
> 🔗 **Backend API Live**: [https://catatcuan.onrender.com/api](https://catatcuan.onrender.com/api)  
> 🎬 **Video Presentasi**: File video demonstrasi lengkap tersedia di [`video/presentasi-catatcuan.mp4`](./video/presentasi-catatcuan.mp4).

---

## Daftar Isi
- [a. Nama dan Deskripsi Aplikasi](#a-nama-dan-deskripsi-aplikasi)
- [b. Nama Peserta](#b-nama-peserta)
- [c. Teknologi yang Digunakan](#c-teknologi-yang-digunakan)
- [d. Daftar Fitur](#d-daftar-fitur)
- [e. Struktur Folder](#e-struktur-folder)
- [f. Cara Membuat dan Menghubungkan Database](#f-cara-membuat-dan-menghubungkan-database)
- [g. Cara Menjalankan Backend](#g-cara-menjalankan-backend)
- [h. Cara Menjalankan Frontend](#h-cara-menjalankan-frontend)
- [i. Daftar Endpoint REST API](#i-daftar-endpoint-rest-api)
- [j. Screenshot Aplikasi](#j-screenshot-aplikasi)
- [Lampiran: Akun Demo Pengujian](#lampiran-akun-demo-pengujian)

---

## a. Nama dan Deskripsi Aplikasi

**Nama Aplikasi**: **CatatCuan** (*Catat Cuan Invoicing & Billing System*)

**Deskripsi**:  
CatatCuan adalah aplikasi manajemen faktur (*invoicing*), penagihan, dan pencatatan pembayaran yang dirancang untuk membantu para pelaku UMKM, pekerja lepas (*freelancer*), dan agensi mengelola siklus transaksi keuangan secara rapi, cepat, dan profesional.

Aplikasi ini mengintegrasikan frontend interaktif berbasis React (Vite & Tailwind CSS) dengan backend tangguh berbasis Spring Boot yang mematuhi prinsip OOP (Object-Oriented Programming), arsitektur berlapis (*layered architecture*), keamanan berbasis JSON Web Token (JWT), isolasi *multi-tenant*, dan basis data relasional PostgreSQL.

---

## b. Nama Peserta

- **Nama Peserta**: **Azhmido**
- **Akun GitHub**: [https://github.com/azhmido](https://github.com/azhmido)
- **Repositori Proyek**: [https://github.com/azhmido/CatatCuan](https://github.com/azhmido/CatatCuan)
- **Tautan Live Demo (Frontend)**: [https://catatcuan-by-azhmido.vercel.app](https://catatcuan-by-azhmido.vercel.app)
- **Tautan Backend API (Render)**: [https://catatcuan.onrender.com/api](https://catatcuan.onrender.com/api)
- **Video Presentasi**: [`video/presentasi-catatcuan.mp4`](./video/presentasi-catatcuan.mp4) (Dapat diakses & di-download langsung dari repositori)

---

## c. Teknologi yang Digunakan

### 1. Backend (Java Spring Boot)
- **Bahasa & Platform**: Java 21 (LTS)
- **Framework**: Spring Boot 3.5.5
- **Modul Spring**: Spring Web, Spring Data JPA, Spring Security 6
- **Database**: PostgreSQL 14+
- **Security & Autentikasi**: JWT (`io.jsonwebtoken:jjwt` 0.12.6) & BCrypt Password Encoder
- **PDF Generation**: iText 7.2.5 (untuk cetak faktur invoice PDF)
- **Boilerplate Reduction**: Project Lombok
- **Build Tool**: Apache Maven (`pom.xml` & Maven Wrapper)

### 2. Frontend (React JS)
- **Library Utama**: React 19 (Functional Components & Hooks)
- **Build Tool / Bundler**: Vite 8
- **Package Manager**: **pnpm**
- **Styling**: Tailwind CSS
- **Routing**: React Router v7 (`react-router-dom`)
- **HTTP Client**: Native `window.fetch()` wrapper terpusat (`src/services/api.js`)
- **Ekspor Dokumen**: CSV Utility exporter untuk mutasi kas masuk

### 3. Kontainerisasi, Database Cloud & Deployment
- **Containerization**: Docker (Multi-stage build `eclipse-temurin:21-alpine` & `maven:3.9-alpine`)
- **Database Cloud**: PostgreSQL Managed Serverless di **Supabase**
- **Cloud Backend**: **Render.com** (Web Service containerized dengan dynamic port binding)
- **Cloud Frontend**: **Vercel** (Global Edge CDN, auto HTTPS, SPA routing via `vercel.json`)

---

## d. Daftar Fitur

1. **Autentikasi & Multi-Tenancy**:
   - Pendaftaran akun bisnis baru (*Register*) dan autentikasi aman (*Login*) menghasilkan JWT token.
   - Setiap tenant memiliki isolasi data penuh: Klien, invoice, dan transaksi pembayaran terisolasi per pengguna.
2. **Manajemen Kontak Klien (CRUD)**:
   - Tambah kontak klien baru, lihat daftar klien, ubah informasi kontak/alamat, serta hapus klien.
   - Pencarian (*search*) dan pengurutan (*sorting*) langsung diproses di backend database via JPA Pageable query parameters.
3. **Manajemen Faktur Invoice (CRUD)**:
   - Pembuatan faktur dengan penomoran invoice otomatis (`INV-YYYY-XXXX`).
   - Penambahan multi-item barang/jasa dengan penghitungan otomatis subtotal dan total harga.
   - Edit invoice, hapus invoice (dengan konfirmasi modal), dan lihat detail faktur berformat modern (*receipt style*).
4. **Siklus Status Invoice**:
   - Pembaruan status instan: **DRAFT** ➔ **SENT (Terkirim)** ➔ **PAID (Lunas)** / **OVERDUE (Jatuh Tempo)**.
5. **Pencatatan Pembayaran & Mutasi Kas**:
   - Catat pelunasan invoice dengan metode pembayaran (Transfer Bank, Tunai, QRIS/E-Wallet).
   - Riwayat mutasi kas masuk lengkap dengan tombol ekspor file **CSV**.
6. **Cetak & Unduh Faktur PDF**:
   - Unduh dokumen faktur invoice berformat PDF resolusi cetak dengan layout profesional via endpoint REST API (`/api/invoices/{id}/pdf`).
7. **Dashboard Analitik**:
   - Kartu metrik total pendapatan lunas, jumlah faktur belum terbayar, dan jumlah faktur jatuh tempo (data riil dari database).
   - Daftar 5 transaksi faktur terkini untuk pantauan kas harian yang cepat.
8. **Tampilan Responsif Mobile & Desktop**:
   - Antarmuka ramah perangkat mobile (menggunakan Dynamic Viewport Height `100dvh` bebas kendala scroll) dengan Bottom Navigation di ponsel dan Sidebar di Desktop.

---

## e. Struktur Folder

```text
CatatCuan/
├── Dockerfile                         # Root Docker multi-stage build Java 21
├── database.sql                       # Skema DDL & seed data PostgreSQL
├── catatcuan-postman-collection.json  # Koleksi pengujian Postman v2.1
├── .gitignore                         # Mengabaikan build artifacts & kredensial
├── README.md                          # Dokumentasi utama proyek
│
├── video/                             # Video rekam layar presentasi proyek
│   └── presentasi-catatcuan.mp4       # Video demonstrasi fitur lengkap (~74 MB)
│
├── backend/                           # Proyek Java Spring Boot
│   ├── Dockerfile                     # Docker container build backend
│   ├── pom.xml                        # Konfigurasi dependensi Maven
│   ├── mvnw / mvnw.cmd                # Maven Wrapper
│   └── src/
│       ├── main/
│       │   ├── java/catatcuan/backend/
│       │   │   ├── config/            # Konfigurasi Security, CORS, Web
│       │   │   ├── controller/        # REST API Controller (Auth, Client, Invoice, Payment, Dashboard, Root)
│       │   │   ├── dto/               # Data Transfer Objects (Request & Response)
│       │   │   ├── entity/            # Entity JPA & BaseEntity (abstract class)
│       │   │   ├── exception/         # Global Exception Handler & Validasi
│       │   │   ├── repository/        # Interface Spring Data JPA Repository
│       │   │   ├── security/          # JwtAuthFilter, JwtService, TenantContext
│       │   │   ├── service/           # Interface Service & Method Overloading
│       │   │   │   └── impl/          # Implementasi logika bisnis
│       │   │   └── util/              # PdfGenerator (iText)
│       │   └── resources/
│       │       ├── application.properties.example # Template konfigurasi
│       │       └── application.properties         # Konfigurasi cloud & fallback
│       └── test/                      # Unit test & Integration test (26 tests)
│
└── frontend/                          # Proyek React Vite
    ├── vercel.json                    # Konfigurasi SPA routing Vercel
    ├── package.json                   # Dependensi frontend & script pnpm
    ├── pnpm-lock.yaml                 # Lockfile pnpm
    ├── vite.config.js                 # Konfigurasi Vite
    ├── index.html                     # Entrypoint HTML
    ├── .env.example                   # Template variabel lingkungan
    ├── .env                           # Variabel lingkungan aktif
    └── src/
        ├── App.jsx                    # Root App component
        ├── components/
        │   ├── layout/                # AppShell, Navbar, Sidebar, BottomNav
        │   └── ui/                    # Button, Card, Modal, Input, Badge, Skeleton
        ├── context/                   # AuthContext & ToastContext
        ├── features/                  # Modul fitur (auth, clients, invoices, payments, dashboard)
        ├── hooks/                     # Custom hooks (useAuth, useToast, useCountUp)
        ├── pages/                     # Halaman aplikasi
        ├── routes/                    # AppRouter & ProtectedRoute
        ├── services/                  # api.js (native fetch client)
        └── utils/                     # Format Rupiah, tanggal, CSV exporter
```

---

## f. Cara Membuat dan Menghubungkan Database

1. **Pastikan PostgreSQL Berjalan** di komputer Anda (port default: `5432`).
2. **Buat Database Baru**:
   Jalankan perintah berikut di psql, pgAdmin, atau terminal Anda:
   ```sql
   CREATE DATABASE catatcuan_db;
   ```
3. **Inisialisasi Tabel & Data Awal (Opsional)**:
   Gunakan file `database.sql` yang berada di direktori root untuk menginisialisasi tabel skema serta akun demo:
   ```bash
   psql -U postgres -d catatcuan_db -f database.sql
   ```
4. **Hubungkan Database ke Backend**:
   Buka file `backend/src/main/resources/application.properties` dan sesuaikan username serta password:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/catatcuan_db
   spring.datasource.username=postgres
   spring.datasource.password=password_db_anda
   ```

---

## g. Cara Menjalankan Backend

1. Buka terminal lalu arahkan ke folder `backend`:
   ```bash
   cd backend
   ```
2. Jalankan backend menggunakan Maven Wrapper:
   - **Windows (CMD/PowerShell)**:
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - **Linux / macOS**:
     ```bash
     ./mvnw spring-boot:run
     ```
3. Backend akan aktif di: **`http://localhost:8080`**.
4. Untuk menjalankan unit test:
   ```cmd
   mvnw.cmd test
   ```

5. **Alternatif: Menjalankan Backend dengan Docker**:
   ```bash
   # Build image Docker Spring Boot
   docker build -t catatcuan-backend .

   # Jalankan kontainer
   docker run -p 8080:8080 catatcuan-backend
   ```

---

## h. Cara Menjalankan Frontend

1. Buka terminal baru lalu arahkan ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Pasang dependensi menggunakan **pnpm**:
   ```bash
   pnpm install
   ```
3. Pastikan konfigurasi file `.env` di dalam folder `frontend` mengarah ke backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Jalankan development server:
   ```bash
   pnpm dev
   ```
5. Buka browser pada alamat: **`http://localhost:5173`**.

---

## i. Daftar Endpoint REST API

Semua respons dikembalikan dalam format JSON terstandarisasi:
```json
{
  "success": true,
  "message": "Deskripsi status operasi",
  "data": { ... }
}
```

| Modul | Method | Endpoint | Deskripsi | Parameter Query / Body |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Pendaftaran tenant baru | Body: `name`, `email`, `password` |
| **Auth** | `POST` | `/api/auth/login` | Masuk & terima JWT token | Body: `email`, `password` |
| **Auth** | `GET` | `/api/auth/me` | Profil pengguna aktif | Header `Authorization: Bearer <token>` |
| **Clients** | `GET` | `/api/clients` | Ambil semua klien (paginasi) | Query: `search`, `sortBy`, `sortDir`, `page`, `size` |
| **Clients** | `POST` | `/api/clients` | Tambah klien baru | Body: `name`, `email`, `phone`, `address` |
| **Clients** | `GET` | `/api/clients/{id}` | Ambil detail satu klien | Path variable: `id` (UUID) |
| **Clients** | `PUT` | `/api/clients/{id}` | Perbarui data klien | Path variable: `id`, Body: updated data |
| **Clients** | `DELETE` | `/api/clients/{id}` | Hapus klien | Path variable: `id` (UUID) |
| **Invoices** | `GET` | `/api/invoices` | Ambil semua faktur | Query: `search`, `status`, `sortBy`, `sortDir`, `page` |
| **Invoices** | `POST` | `/api/invoices` | Buat faktur invoice baru | Body: `clientId`, `items`, `issueDate`, `dueDate` |
| **Invoices** | `GET` | `/api/invoices/{id}` | Ambil detail faktur & items | Path variable: `id` (UUID) |
| **Invoices** | `PUT` | `/api/invoices/{id}` | Edit faktur & rincian item | Path variable: `id`, Body: data invoice |
| **Invoices** | `DELETE` | `/api/invoices/{id}` | Hapus faktur invoice | Path variable: `id` (UUID) |
| **Invoices** | `PATCH` | `/api/invoices/{id}/status` | Ubah status invoice | Query: `status` (`DRAFT`/`SENT`/`PAID`/`OVERDUE`) |
| **Invoices** | `POST` | `/api/invoices/{id}/payments`| Catat pembayaran faktur | Body: `amount`, `paymentMethod`, `notes` |
| **Invoices** | `GET` | `/api/invoices/{id}/pdf` | Download faktur berformat PDF | Mengembalikan file stream `application/pdf` |
| **Payments** | `GET` | `/api/payments` | Riwayat seluruh mutasi | Header `Authorization: Bearer <token>` |
| **Dashboard** | `GET` | `/api/dashboard/summary` | Metrik omset, unpaid, overdue | Header `Authorization: Bearer <token>` |
| **Dashboard** | `GET` | `/api/dashboard/recent-invoices` | 5 Invoice transaksi terkini | Header `Authorization: Bearer <token>` |

> **Pengujian dengan Postman**: Import file `catatcuan-postman-collection.json` ke Postman. Koleksi tersebut telah mencakup seluruh skenario CRUD, validasi, search, dan sorting.

---

## j. Screenshot Aplikasi

Berikut adalah halaman-halaman antarmuka utama dalam aplikasi **CatatCuan**:

| Halaman | Deskripsi Tampilan |
| :--- | :--- |
| **Landing Page** | Halaman beranda modern dengan pengenalan fitur, estimasi keuntungan, dan tombol pendaftaran. |
| **Login & Register** | Formulir autentikasi responsif dengan validasi data dan integrasi keamanan JWT. |
| **Dashboard** | Ringkasan kartu metrik omset real-time, grafik ringkas, dan daftar transaksi terbaru. |
| **Daftar Klien (Clients)** | Tabel/kartu kontak klien dengan fitur pencarian instan, sorting kolom, dan paginasi. |
| **Pembuatan Invoice** | Formulir pembuatan faktur multi-item dengan kalkulasi dinamis subtotal dan total harga. |
| **Detail Faktur (Invoice View)** | Tampilan faktur profesional bergaya nota (*receipt style*) lengkap dengan tombol unduh PDF resmi. |
| **Buku Kas / Mutasi Pembayaran** | Riwayat transaksi pelunasan faktur yang dapat diekspor langsung menjadi file `.csv`. |

---

## Lampiran: Akun Demo Pengujian

Untuk mempermudah pengujian aplikasi tanpa registrasi manual:

- **Email**: `demo@catatcuan.id`
- **Kata Sandi**: `password123`
- **Nama Bisnis**: `Studio Solusi Kreatif`
- **Catatan**: Akun ini telah dilengkapi sampel data klien, faktur dengan berbagai status, dan riwayat transaksi di dalam `database.sql`.