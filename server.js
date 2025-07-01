const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const PAYSTACK_SECRET = "sk_live_dddd6532acd10e230d6b01b4b03b516ac37e8b9c"; // Your real secret key
const TELEGRAM_BOT_TOKEN = "7804742191:AAHL4adoGw1qzKb8d7nX4uWz4VYH6bh-UP0"; // Bots.Business token

// ✅ Create Paystack link
app.post("/create-paystack-link", async (req, res) => {
  const { telegram_id, amount } = req.body;

  if (!telegram_id || !amount) return res.status(400).json({ success: false, message: "Missing data" });

  const email = `${telegram_id}@megabetnation.com`;
  const payload = {
    email: email,
    amount: amount * 100,
    currency: "NGN",
    callback_url: "https://your-render-app.onrender.com/paystack/callback",
    metadata: {
      telegram_id: telegram_id
    }
  };

  try {
    const response = await axios.post("https://api.paystack.co/transaction/initialize", payload, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`
      }
    });

    return res.json({ success: true, url: response.data.data.authorization_url });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ success: false, error: "Failed to generate payment link" });
  }
});

// ✅ Paystack webhook (credit user)
app.post("/paystack/callback", async (req, res) => {
  const event = req.body;

  if (event.event === "charge.success") {
    const amount = event.data.amount / 100;
    const telegramId = event.data.metadata.telegram_id;

    // Send deposit command to bot
    await axios.post(`https://api.bots.business/v1/bot/${TELEGRAM_BOT_TOKEN}/runCommand`, {
      user_id: telegramId,
      command: "/credit_wallet",
      amount: amount
    });
  }

  res.sendStatus(200);
});

// Optional: Test route
app.get("/ping", (req, res) => {
  res.send("✅ MegaBet Nation backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server live on port ${PORT}`);
});
