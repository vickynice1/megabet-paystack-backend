const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET; // Load from .env for security
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Load from .env

// ✅ Create Paystack link
app.post("/create-paystack-link", async (req, res) => {
  const { telegram_id, amount } = req.body;

  if (!telegram_id || !amount) {
    return res.status(400).json({ success: false, message: "Missing telegram_id or amount" });
  }

  const payload = {
    email: `telegram_id@megabetnation.com`,
    amount: amount * 100,
    currency: "NGN",
    callback_url: "https://megabet-paystack-backend.onrender.com/paystack/callback",
    metadata:  telegram_id ;

  try 
    const response = await axios.post("https://api.paystack.co/transaction/initialize", payload, 
      headers:  Authorization: `Bearer{PAYSTACK_SECRET}` }
    });

    return res.json({ success: true, url: response.data.data.authorization_url });
  } catch (err) {
console.error("Paystack Error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Failed to create payment link" });
  }
});

// ✅ Paystack webhook
app.post("/paystack/callback", async (req, res) => {
  const event = req.body;

  if (event.event === "charge.success") {
    const amount = event.data.amount / 100;
    const telegramId = event.data.metadata?.telegram_id;

    if (telegramId) {
      try {
        await axios.post(`https://api.bots.business/v1/bot/TELEGRAM_BOT_TOKEN/runCommand`, 
          user_id: telegramId,
          command: "/credit_wallet",
          amount
        );
       catch (err) 
        console.error("Telegram Callback Error:", err.message);
      

  res.sendStatus(200);
);

// Test route
app.get("/ping", (req, res) => 
  res.send("✅ MegaBet Nation backend is live");
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
  console.log(`🌐 Server running on port{PORT}`);
});
