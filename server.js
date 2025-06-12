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
  "https://affiliate-tanpa-ribet.vercel.app",
  "https://affiliate-tanpa-ribet-production.up.railway.app"
];

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
app.options("*", cors());

app.use(express.json());

// ✅ Midtrans Snap Client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

// ✅ ROUTE: Home test
app.get("/", (req, res) => {
  res.send("✅ Backend aktif: Midtrans Snap siap digunakan!");
});

// ✅ Gunakan express.Router untuk routing aman
const router = express.Router();

// ✅ Route tes root
router.get("/", (req, res) => {
  res.send("✅ Backend aktif tanpa error path-to-regexp");
});

// ✅ ROUTE: Buat Transaksi (pakai POST dari checkout.html)
app.post("/create-transaction", async (req, res) => {
  try {
    const { nama, email, whatsapp } = req.body;

    const parameter = {
      transaction_details: {
        order_id: "AFF-" + Date.now(),
        gross_amount: 20000
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: nama || "User",
        email: email || "user@example.com",
        phone: whatsapp || "+628000000000"
      }
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (err) {
    console.error("❌ Midtrans error:", err.message);
    res.status(500).json({ error: "Gagal membuat transaksi Midtrans." });
  }
});

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
