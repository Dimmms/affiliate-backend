import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import midtransClient from "midtrans-client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "https://affiliate-frontend-kappa.vercel.app",
  "http://localhost:3000",
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

app.use(express.json());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("🚀 Affiliate Midtrans Backend Online!");
});

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
        gross_amount: 99000
      },
      item_details: [
        {
          id: "ITEM1",
          price: 99000,
          quantity: 1,
          name: "1000+ Video Affiliate",
          brand: "Kadar Digi",
          category: "Digital Product",
          merchant_name: "Kadar Digi",
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

    console.log("🔄 Creating transaction with:", parameter);
    const transaction = await snap.createTransaction(parameter);

    res.json({ token: transaction.token });
  } catch (err) {
    console.error("❌ Midtrans error:", err.message);
    res.status(500).json({ error: "Gagal membuat transaksi Midtrans." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});