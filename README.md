# 🎟️ GoFest — Event Ticketing Marketplace

GoFest adalah platform marketplace ticketing online modern yang mempertemukan Event Organizer (EO) dengan calon pembeli tiket konser musik, festival, seminar, dan hiburan lainnya. Dilengkapi dengan sistem verifikasi e-ticket QR code untuk staf lapangan dan dashboard approval untuk admin.

Desain antarmuka terinspirasi dari standar industri seperti **Artatix** dan **Loket.com**, menghadirkan pengalaman pengguna yang cepat, visual yang memukau, dan alur pembelian tanpa ribet (*frictionless guest checkout*).

---

## 🚀 Fitur Utama per Role

### 1. 🛍️ Buyer (Publik - Tanpa Akun)
- **Pencarian & Filter Interaktif**: Cari berdasarkan nama artis, lokasi/kota, dan kategori event.
- **Hero Carousel Coverflow**: Banner event unggulan interaktif dengan visual menawan.
- **Detail Event & Multi-Tier Tiket**: Informasi lengkap venue, jadwal, dan kuota tiket real-time.
- **Guest Checkout Cepat**: Pembelian instan hanya dengan mengisi Nama, Email, dan WhatsApp (tanpa registrasi akun).
- **Simulasi Payment Gateway**: Mendukung Virtual Account BCA/Mandiri, QRIS, GoPay, dan Kartu Kredit dengan batas waktu pembayaran.
- **E-Ticket Digital dengan QR Code Unik**: E-ticket resmi yang dapat diunduh, dicetak, dan diverifikasi di pintu masuk.

### 2. 🎪 Event Organizer (EO)
- **Pendaftaran Organisasi**: Registrasi mandiri dengan verifikasi berkas oleh Admin.
- **Manajemen Event & Jenis Tiket**: Buat event baru, tentukan kuota dan harga bertingkat (Early Bird, Presale, Regular, VIP).
- **Manajemen Staf Lapangan**: Tambah akun staf verifikator tiket dan tugaskan ke event spesifik.
- **Laporan Penjualan**: Pantau sisa kuota, jumlah tiket terjual, dan estimasi omzet pendapatan.

### 3. 🛡️ Admin Platform
- **Monitoring Marketplace**: Ringkasan total transaksi, omzet GMV, dan status event.
- **Approval EO**: Verifikasi dan setujui / tolak pendaftaran Event Organizer baru.
- **Approval Event**: Review event baru yang diajukan EO sebelum ditayangkan ke publik.

### 4. 📱 Staf Lapangan / Verifikator
- **Pemindai Kamera QR Code**: Integrasi scanner kamera langsung di browser (`html5-qrcode`) & input manual kode tiket.
- **Validasi Tiket Real-Time**:
  - 🟢 **Valid**: Tiket sah dan belum dipakai, menampilkan nama pemegang tiket & waktu check-in.
  - 🔴 **Sudah Digunakan**: Peringatan duplikasi tiket dengan riwayat jam check-in sebelumnya.
  - 🟡 **Tidak Ditemukan / Tidak Ditugaskan**: Peringatan tiket tidak sah.
- **Log Riwayat Check-In**: Catatan riwayat pengunjung yang berhasil masuk.

---

## 🛠️ Tech Stack Frontend

- **Build Tool**: Vite
- **Framework**: React 18+ (Functional Components & Hooks)
- **Styling**: Tailwind CSS (Desain kustom Artatix Deep Blue `#0f2370`, modern gradients, glassmorphism)
- **Icons**: Lucide React
- **QR Engine**: `qrcode.react` (Generator e-ticket) & `html5-qrcode` (Scanner kamera staf)
- **State & Storage**: Persistent LocalStorage with reactive seed data
- **Routing**: React Router DOM v6

---

## 🔑 Akun Demo Pengujian Cepat

Tersedia fitur **"Quick Demo Switcher"** di navbar untuk langsung mencoba peran apa pun dengan 1 klik:

| Role | Email | Password | Keterangan |
|---|---|---|---|
| **Admin** | `admin@gofest.id` | `admin123` | Akses penuh dashboard approval |
| **EO (Approved)** | `eo@rememberfest.id` | `eo123` | Promotor Remember Fest & Ayofest |
| **EO (Pending)** | `eo@nusantara.id` | `eo123` | Contoh akun EO menunggu approval Admin |
| **Staff** | `staff@gofest.id` | `staff123` | Staf verifikator tiket lapangan |
| **Buyer** | *(Tanpa Login)* | - | Langsung pilih tiket di halaman utama |

---

## 💻 Cara Menjalankan Proyek

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Akses di browser
# Buka http://localhost:5173
```
