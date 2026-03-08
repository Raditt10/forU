# 💌 forU - Buat Kamu (Interactive Love Confession Web)

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" />
</p>

**forU (Buat Kamu)** adalah web interaktif untuk menyatakan perasaan secara kreatif dan romantis! Kirim link spesial lewat Discord atau langsung, dan biarkan animasi amplop, countdown dramatis, kartu gombalan, serta tombol "gamau" yang lari-larian membantu kamu nembak doi.

Kalau doi jawab **"IYA mau!"**, confetti bertebaran, lagu romantis menyala, dan notifikasi otomatis masuk ke Discord kamu secara real-time! 💖

---

## 📸 Preview

<div align="center">
  <table style="border: none; border-collapse: collapse; display: inline-table;">
    <tr style="border: none;">
      <td style="border: none; padding: 5px;">
        <img src="./screenshot/Screenshot%202026-03-08%20091646.png" alt="Envelope & Countdown" width="380px" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      </td>
      <td style="border: none; padding: 5px;">
        <img src="./screenshot/Screenshot%202026-03-08%20091743.png" alt="Accepted / Jadian" width="380px" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      </td>
    </tr>
  </table>

  <br>

  <table style="border: none; border-collapse: collapse; display: inline-table; margin-top: 10px;">
    <tr style="border: none;">
      <td style="border: none; padding: 5px;">
        <img src="./screenshot/Screenshot%202026-03-08%20091702.png" alt="Kartu Gombalan" width="260px" style="border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
      </td>
    </tr>
  </table>
</div>

---

## ✨ Fitur Utama

### 🎬 Pengalaman Interaktif
* **Animasi Amplop** — Klik amplop untuk membukanya, reveal pesan dengan animasi GSAP yang smooth.
* **Countdown Dramatis** — Efek hitung mundur 3… 2… 1… sebelum masuk ke inti pesan.
* **Tombol "gamau" Kabur** — Tombol bergerak menghindar (runaway button) saat coba diklik, bikin doi gemes!
* **Confetti & Lagu** — Auto-play lagu romantis (`somebody_pleasure.mp3`) dan hujan confetti saat diterima.

### 🎨 Visual & Audio
* **Heart Effect** — Animasi hujan hati di background untuk suasana romantis.
* **Responsive Design** — Tampilan tetap cantik di HP maupun Desktop.
* **Audio Crossfade** — Transisi musik yang halus saat status berubah menjadi "Accepted".

### ⚙️ Backend & Discord Integrasi
* **Discord Bot** — Command `!tembak NamaDia` untuk generate link instan.
* **Real-time Webhook** — Notifikasi langsung ke server Discord kamu saat jawaban diklik.

---

## 🛠️ Tech Stack

### Frontend
| Tech | Versi | Deskripsi |
| :--- | :--- | :--- |
| **React** | 19 | UI Framework |
| **Vite** | 7 | Build Tool |
| **TypeScript** | 5.9 | Type Safety |
| **GSAP** | 3.14 | Animation Engine |

### Backend
| Tech | Deskripsi |
| :--- | :--- |
| **Node.js** | Runtime Environment |
| **Express.js 5** | Web Framework |
| **Discord.js** | Bot Integration |

---

## 🚀 Cara Instalasi

### 1. Clone Repository
```bash
git clone [https://github.com/username/forU.git](https://github.com/username/forU.git)
cd forU

```

### 2. Setup Backend

```bash
cd backend
npm install
# Buat file .env dan masukkan:
# PORT, DISCORD_BOT_TOKEN, DISCORD_WEBHOOK_URL, FRONTEND_URL
node server.js

```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev

```

---

## 📄 Lisensi

Project ini bebas digunakan untuk keperluan hiburan dan personal. Dibuat dengan ❤️ oleh **Kanjirouu**.

```
