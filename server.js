import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import midtransClient from "midtrans-client";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://affiliate-frontend-kappa.vercel.app",
  "https://affiliate-backend.up.railway.app"
];

// Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Pre-flight untuk semua route
app.options("*", cors());

// Parse JSON
app.use(express.json());


// ✅ Midtrans Snap Client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

// ✅ Home route
app.get("/", (req, res) => {
  res.send("✅ Backend aktif: Midtrans Snap siap digunakan!");
});

// ✅ Buat Transaksi
app.post("/create-transaction", async (req, res) => {
  try {
    const { nama, email, whatsapp } = req.body;

    if (!nama || !email || !whatsapp) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    const parameter = {
      transaction_details: {
        order_id: "AFF-" + Date.now(),
        gross_amount: 99000
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: nama,
        email: email,
        phone: whatsapp
      }
    };

    // Debug log (di dalam try block)
    console.log("📥 Data masuk:", req.body);
    console.log("📦 Midtrans payload:", parameter);

    const transaction = await snap.createTransaction(parameter);
    console.log("✅ Snap token:", transaction.token);

    res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });

  } catch (err) {
    console.error("❌ Midtrans error:", err.message);
    res.status(500).json({ error: "Gagal membuat transaksi Midtrans." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
