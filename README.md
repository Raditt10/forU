# 💌 forU - Buat Kamu (Interactive Love Confession Web)

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js_5-000000?style=flat&logo=express&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js_v14-5865F2?style=flat&logo=discord&logoColor=white)

**forU (Buat Kamu)** adalah web interaktif untuk nembak doi secara kreatif dan romantis! Kirim link spesial lewat Discord atau langsung, dan biarkan animasi amplop, countdown dramatis, kartu gombalan, serta tombol "gamau" yang kabur-kaburan membantu kamu menyatakan perasaan.

Kalau doi jawab **"IYA mau!"**, confetti bertebaran, lagu romantis menyala, dan notifikasi otomatis masuk ke Discord kamu! 💖

---

## 📸 Preview

<p align="center">
  <img src="./screenshot/Screenshot%202026-03-08%20091646.png" alt="Envelope & Countdown" width="30%" style="border-radius: 12px; margin: 8px;">
  <img src="./screenshot/Screenshot%202026-03-08%20091702.png" alt="Kartu Gombalan" width="30%" style="border-radius: 12px; margin: 8px;">
  <img src="./screenshot/Screenshot%202026-03-08%20091743.png" alt="Accepted / Jadian" width="30%" style="border-radius: 12px; margin: 8px;">
</p>

---

## ✨ Fitur Utama

### 🎬 Pengalaman Interaktif

- **Animasi Amplop** — Klik amplop untuk membukanya, reveal pesan dengan animasi GSAP (~4 detik)
- **Countdown Dramatis** — Hitung mundur 3… 2… 1… lalu muncul teks *"janji, gaakan kaget ya {Nama}"*
- **Tombol "gamau" Kabur** — Setelah 3x klik, tombol bergerak menghindar (transform-based, tetap di dalam kartu!)
- **Label Progresif** — Tombol berubah: "gamau" → "gamau ihh" → "pokoknya gamau" → dst
- **Confetti & Lagu** — Kalau doi tekan **"IYA mau!"**, confetti bertebaran + lagu romantis otomatis dengan crossfade
- **Kartu Jadian** — Muncul kartu tanggal jadian & kartu couple setelah diterima

### 🎨 Visual & Audio

- **Heart Effect** — Animasi hujan hati di background
- **GSAP Entrance** — Staggered reveal: kartu → judul → gambar → tombol
- **Background Music** — Musik latar otomatis dengan crossfade ke lagu penerimaan (`somebody_pleasure.mp3`)
- **Responsive** — Optimal di HP maupun desktop
- **Tombol Info "?"** — Info cara pakai web, tampil di semua halaman

### ⚙️ Backend & Discord

- **Discord Bot** — Command `!tembak NamaDia` atau `!gombal NamaDia` untuk generate link spesial
- **Discord Webhook** — Notifikasi real-time ke server saat doi klik "IYA mau!"
- **URL Parameter** — Bisa langsung buat link manual: `/?target=NamaDia`

---

## 🛠️ Tech Stack

### Frontend

| Tech | Versi |
|------|-------|
| React | 19 |
| Vite | 7 |
| TypeScript | 5.9 |
| GSAP | 3.14 |
| canvas-confetti | 1.9 |

### Backend

| Tech | Versi |
|------|-------|
| Node.js | LTS |
| Express.js | 5 |
| Discord.js | 14 |
| dotenv | 17 |

---

## 📁 Struktur Project

```text
forU/
├── backend/
│   ├── utils/
│   │   ├── discord.js          # Webhook notification ke Discord
│   │   └── discordBot.js       # Bot handler (!tembak & !gombal)
│   ├── server.js               # Entry point backend (Express)
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── somebody_pleasure.mp3  # Lagu penerimaan (crossfade)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Background.tsx     # Animated background
│   │   │   ├── Gombalan.tsx       # Kartu utama (YES/NO, runaway, acceptance)
│   │   │   └── HeartEffect.tsx    # Efek hujan hati
│   │   ├── App.tsx                # Root (envelope, countdown, tech info)
│   │   ├── App.css & index.css    # Styling & animasi
│   │   └── main.tsx               # Entry point React
│   ├── vite.config.ts
│   └── package.json
│
├── screenshot/                    # Screenshot preview
└── README.md
```

---

## ⚙️ Cara Instalasi & Menjalankan

### 1. Persiapan

- [Node.js](https://nodejs.org/) (LTS)
- Token Bot Discord dan/atau Webhook URL

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
PORT=5000
DISCORD_BOT_TOKEN=token_bot_kamu
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
FRONTEND_URL=https://domain-kamu.com
```

Jalankan:

```bash
node server.js
```

_Backend berjalan di `http://localhost:5000`_

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

_Frontend berjalan di `http://localhost:5173`_

---

## 🚀 Cara Penggunaan

### Via Discord Bot

1. Ketik di channel yang ada bot-nya:
   ```
   !tembak NamaDia
   ```
   atau:
   ```
   !gombal NamaDia
   ```
2. Bot akan balas dengan link spesial.
3. Kirim link tersebut ke doi (DM / WhatsApp / IG).

### Via URL Manual

Tambahin `?target=NamaDia` di belakang URL:

```
https://domain-kamu.com/?target=Sayang
```

### Alur yang Dilihat Doi

1. 🎬 **Amplop** — Klik untuk buka
2. ⏱️ **Countdown** — 3… 2… 1… + pesan hint
3. 💕 **Kartu Gombalan** — Nama doi tampil, tombol "IYA mau!" dan "gamau"
4. 😂 **Tombol Kabur** — "gamau" menghindar, label makin lucu
5. 🎉 **Diterima!** — Confetti + lagu + kartu jadian muncul
6. 📩 **Notifikasi Discord** — Kamu dapat notif di server!

---

## ☁️ Deployment

- **Frontend**: [Vercel](https://vercel.com), [Netlify](https://netlify.com), atau [Cloudflare Pages](https://pages.cloudflare.com) (`npm run build`)
- **Backend**: [Render](https://render.com), [Railway](https://railway.app), atau VPS manapun

---

## 📄 Lisensi

Project ini dibuat untuk pembelajaran, hiburan, dan nembak doi. Bebas digunakan, di-clone, dan dimodifikasi sesukamu.

_Code with ❤️ by Kanjirouu._
