import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import midtransClient from "midtrans-client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Daftar frontend yang diizinkan mengakses backend
const allowedOrigins = [
  "https://affiliate-frontend-kappa.vercel.app",
  "http://localhost:3000",
];

// ✅ Konfigurasi CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.options("*", cors());

// ✅ Tes koneksi backend
app.get("/", (req, res) => {
  res.send("🚀 Backend Midtrans untuk Affiliate Tanpa Ribet aktif!");
});

// ✅ Endpoint Midtrans: buat token transaksi
app.post("/create-transaction", async (req, res) => {
  try {
    const { nama, email, whatsapp } = req.body;

    if (!nama || !email || !whatsapp) {
      return res.status(400).json({ error: "Semua data wajib diisi." });
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    const parameter = {
      transaction_details: {
        order_id: "AFF-" + Date.now(),
        gross_amount: 45000
      },
      item_details: [
        {
          id: "ITEM1",
          price: 45000,
          quantity: 1,
          name: "1000+ Video Affiliate",
          brand: "Kadar Digi",
          category: "Digital Product",
          merchant_name: "Affiliate Tanpa Ribet",
          url: "https://affiliate-frontend-kappa.vercel.app"
        }
      ],
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: nama,
        email: email,
        phone: whatsapp
      }
    };

    console.log("🔁 Kirim transaksi ke Midtrans:", parameter);
    const transaction = await snap.createTransaction(parameter);

    res.json({ token: transaction.token });
  } catch (err) {
    console.error("❌ Midtrans error:", err.message);
    res.status(500).json({ error: "Gagal membuat transaksi Midtrans." });
  }
});

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server aktif di http://localhost:${PORT}`);
});
