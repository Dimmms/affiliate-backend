import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import midtransClient from "midtrans-client";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Static public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Midtrans Client Config
const snap = new midtransClient.Snap({
  isProduction: false, // ✅ false untuk Sandbox Midtrans
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Route untuk test Snap
app.get("/check-payments", async (req, res) => {
  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: `TEST-${Date.now()}`,
        gross_amount: 10000
      }
    });

    res.send(`
      <h2>Status Snap Token Berhasil Dibuat</h2>
      <p>Token: ${transaction.token}</p>
      <p><a href="${transaction.redirect_url}" target="_blank">🔗 Cek di Snap UI</a></p>
    `);
  } catch (error) {
    console.error("❌ Gagal cek metode pembayaran:", error.message);
    res.status(500).send("Gagal cek metode pembayaran.");
  }
});

// Buat Transaksi Midtrans
app.post("/create-transaction", async (req, res) => {
  const { nama, email, whatsapp } = req.body;
  const orderId = `ORDER-${Date.now()}-${nama.replace(/\s+/g, "-")}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: 45000
    },
    customer_details: {
      first_name: nama,
      email,
      phone: whatsapp
    },
    enabled_payments: [
      "bca_va", "bni_va", "bri_va", "permata_va", "echannel",
      "gopay", "shopeepay", "ovo", "dana", "linkaja",
      "alfamart", "indomaret", "qris"
    ]
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    console.log("✅ Token dibuat:", transaction.token);
    console.log("🔗 Redirect URL:", transaction.redirect_url);
    res.json({ token: transaction.token });
  } catch (err) {
    console.error("❌ Gagal buat transaksi:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Midtrans Webhook Endpoint
app.post("/midtrans-notify", express.json(), async (req, res) => {
  const notification = req.body;

  try {
        const core = new midtransClient.CoreApi({
      isProduction: false, // ✅ Sandbox mode
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const statusResponse = await core.transaction.notification(notification);

    const {
      transaction_status,
      order_id,
      gross_amount,
      payment_type,
      transaction_time
    } = statusResponse;

    await fetch("https://script.google.com/macros/s/AKfycbzc61FBsea0K-WjGlm9PZq963x0yWTcy84X6Qro3J-F82nqPqzpys6u7F_hTAmSwgca/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        order_id,
        status: transaction_status,
        payment_type,
        amount: gross_amount,
        waktu: transaction_time
      })
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error webhook:", error.message);
    res.status(500).send("Webhook error");
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`)
);
