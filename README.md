# 📦 Affiliate Landing — 1000+ Video Siap Pakai untuk Affiliate

🚀 Landing page & sistem pembayaran untuk menjual produk digital berupa **1000+ video affiliate siap pakai**, cocok untuk siapa saja yang ingin mulai cuan dari affiliate tanpa bikin konten.

---

## ✨ Fitur Utama

- ✅ **1000+ video promosi** siap pakai
- ✅ Checkout instan via Midtrans (QRIS, e-wallet, transfer bank)
- ✅ Otomatis simpan data ke Google Sheets
- ✅ UI modern dengan HTML + CSS custom
- ✅ Webhook untuk update status pembayaran

---

## 🛠️ Teknologi yang Digunakan

- Node.js + Express
- Midtrans Snap API (Payment Gateway)
- Google Apps Script (untuk Google Sheets)
- HTML, CSS, JS
- Railway (Deployment)

---

## 📦 Struktur Project

```bash
.
├── server.js              # Backend Express + Midtrans
├── index.html             # Landing page utama
├── checkout.html          # Halaman pembayaran
├── diskon-harga.html      # Halaman promo
├── script.js              # Script client
├── style.css              # Styling global
├── public/                # Folder assets
├── .env                   # [TIDAK DICOMMIT] Kunci Midtrans
└── package.json
