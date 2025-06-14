import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import midtransClient from "midtrans-client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allowlist frontend dari Vercel & localhost
const allowedOrigins = [
  "http://localhost:3000",
  "https://affiliate-frontend-kappa.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Origin tidak diizinkan oleh CORS: " + origin));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.options("*", cors());

// ✅ Route tes
app.get("/", (req, res) => {
  res.send("🚀 Backend Midtrans aktif dan siap digunakan.");
});

// ✅ Endpoint Snap Midtrans
app.post("/create-transaction", async (req, res) => {
  try {
    const { nama, email, whatsapp } = req.body;

    if (!nama || !email || !whatsapp) {
      return res.status(400).json({ error: "Semua data wajib diisi." });
    }

    const snap = new midtransClient.Snap({
      isProduction: false, // ⛔ Ubah ke true jika pakai Production
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
          url: "https://affiliate-frontend-kappa.vercel.app/"
        }
      ],
      credit_card: { secure: true },
      customer_details: {
        first_name: nama,
        email: email,
        phone: whatsapp,
        billing_address: {
          first_name: nama,
          last_name: "Customer",
          email: email,
          phone: whatsapp,
          address: "Jl. Sudirman No. 88",
          city: "Jakarta",
          postal_code: "12190",
          country_code: "IDN"
        },
        shipping_address: {
          first_name: nama,
          last_name: "Customer",
          email: email,
          phone: whatsapp,
          address: "Jl. Sudirman No. 88",
          city: "Jakarta",
          postal_code: "12190",
          country_code: "IDN"
        }
      }
    };

    // ✅ Debug log
    console.log("🔁 Parameter:", JSON.stringify(parameter, null, 2));

    const transaction = await snap.createTransaction(parameter);
    res.json({ token: transaction.token });

  } catch (err) {
    console.error("❌ Midtrans error:", err.message);
    res.status(500).json({ error: "Gagal membuat transaksi Midtrans." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server aktif di http://localhost:${PORT}`);
});
