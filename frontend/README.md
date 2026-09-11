# CatatCuan — Frontend Web Invoicing & Billing Workspace

CatatCuan adalah aplikasi web modern untuk membantu freelancer, konsultan, dan pelaku UMKM mengelola penagihan invoice resmi, memantau mutasi arus kas piutang (*cashflow*), mencatat pembayaran, dan mengunduh kuitansi PDF standar bisnis.

---

## 🚀 Fitur Unggulan

1. **Dashboard Buku Kas & Piutang Real-time**:
   * Ringkasan pendapatan terkumpul, invoice menunggu pembayaran, dan tagihan lewat jatuh tempo.
   * Dilengkapi mikro-animasi hitung angka (*count-up*) dan navigasi interaktif ke data mutasi.
2. **Manajemen Invoice Lengkap (CRUD)**:
   * Pembuatan invoice baru dengan penambahan item pekerjaan dan kalkulasi subtotal dinamis.
   * Edit data nota tagihan aktif.
   * Transisi status langsung (*Draft* $\rightarrow$ *Terkirim* $\rightarrow$ *Lunas*).
   * **Duplikat Tagihan (*Clone Invoice*)**: Membuat tagihan baru dari template tagihan sebelumnya hanya dengan 1 klik.
   * **Cetak & Unduh PDF**: Format nota akuntansi fisik bersih tanpa navbar/sidebar saat dicetak.
   * **Kirim Tagihan via WhatsApp**: Teks pesan penagihan otomatis ke nomor WA klien.
   * **Salin Ringkasan ke Clipboard**: Menyalin format ringkasan invoice untuk dikirim via Telegram, DM, Email, atau Slack.
3. **Pencarian, Multi-Sorting, & Filter**:
   * Pencarian *real-time* di halaman Invoice, Klien, dan Mutasi Pembayaran.
   * Pengurutan berdasarkan tanggal (terbaru/terlama) dan nominal (tertinggi/terendah).
   * Filter pill status (*Semua, Draft, Terkirim, Lunas, Telat*) terintegrasi URL query params.
4. **Ekspor Data ke Format CSV**:
   * Mengunduh seluruh data daftar invoice atau mutasi kas masuk ke format `.csv` dengan encoding UTF-8 BOM yang langsung terbaca rapi di Microsoft Excel.
5. **Manajemen Klien**:
   * Direktori kontak penagihan, alamat, email, dan telepon klien dengan validasi formulir interaktif.
6. **Buku Mutasi Kas Masuk**:
   * Riwayat pembayaran lunas dengan pencatatan tanggal, metode bayar (Transfer Bank, Tunai, QRIS/E-Wallet), dan catatan setoran.
7. **Keamanan & UX Safety**:
   * Modal dialog konfirmasi saat menghapus invoice, menghapus klien, dan konfirmasi saat keluar akun (*logout*).
   * Notifikasi toast responsif pada seluruh aksi pengguna.
   * Mode Akses Cepat Demo (1 klik) untuk pengujian UI lengkap tanpa ketergantungan server backend.

---

## 🛠️ Arsitektur & Teknologi

* **Framework**: React 19 (Functional Components + Hooks + JSX)
* **Build Tool**: Vite 8 & pnpm
* **Routing**: React Router DOM v7 (Dynamic Routes, Nested Routes, Protected Routes, Search Params)
* **Styling**: Tailwind CSS v4 (Design System: Deep Pine Slate `#0f291e`, Executive Emerald Accent `#047857`, Warm Stone Neutral `#f5f6f4`)
* **HTTP Client**: Axios dengan JWT Interceptors & graceful error fallback
* **Linting**: ESLint dengan aturan resmi React Compiler & React Hooks

---

## 📁 Struktur Folder Proyek

```text
src/
├── assets/         # Aset grafis & logo vector (logo.svg)
├── components/     # Komponen UI reusable & Layout
│   ├── layout/     # AppShell, Navbar, Sidebar, BottomNav, PageHeader
│   └── ui/         # Button, Input, Card, Badge, Modal, EmptyState, Skeleton
├── features/       # Halaman & logika per domain bisnis (Pages & API Services)
│   ├── auth/       # Login, Register, Form, & Auth API
│   ├── clients/    # Daftar Klien, Profil Klien, Form Klien Baru
│   ├── dashboard/  # Dashboard Metrik & Design UI Preview
│   ├── home/       # Landing Page Publik & Akses Demo
│   ├── invoices/   # Daftar Invoice, Detail Invoice, Form Buat & Edit Invoice
│   └── payments/   # Buku Mutasi Arus Kas Masuk & Filter Metode
├── context/        # AuthContext & State Global
├── hooks/          # useAuth, useToast, useCountUp
├── services/       # Instance API Axios & Service Endpoints
├── styles/         # Token tema CSS variables (themes.css)
└── utils/          # Formatter mata uang rupiah, tanggal, & utilitas ekspor CSV
```

---

## ⚡ Panduan Menjalankan Aplikasi

### 1. Instalasi Dependensi
```bash
pnpm install
```

### 2. Menjalankan Development Server
```bash
pnpm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

### 3. Pengecekan Kualitas Kode (Linting)
```bash
pnpm run lint
```
*Hasil:* **0 Error, 0 Warning**.

### 4. Build Produksi
```bash
pnpm run build
```
*Hasil:* Bundle produksi terkompilasi bersih di folder `/dist`.
