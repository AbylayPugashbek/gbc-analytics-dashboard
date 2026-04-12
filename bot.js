require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.RETAILCRM_API_KEY;
const BASE_URL = process.env.RETAILCRM_URL;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const THRESHOLD = 50000;

// чтобы не спамить
let seenOrders = new Set();

async function sendTelegram(text) {
  await axios.post(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML"
    }
  );
}

function formatOrder(order) {
  return `
🔥 <b>High Value Order</b>

👤 ${order.firstName || ""} ${order.lastName || ""}
💰 ${order.totalSumm || 0} ₸
📞 ${order.phone || "no phone"}
📧 ${order.email || "no email"}
🆔 ${order.externalId || order.id}
`;
}

async function checkOrders() {
  try {
    const res = await axios.get(`${BASE_URL}/orders`, {
      params: {
        apiKey: API_KEY,
        limit: 20
      }
    });

    const orders = res.data.orders || [];

    for (const o of orders) {
      const id = o.id;

      const sum = Number(o.totalSumm || 0);

      // защита от дублей
      if (seenOrders.has(id)) continue;
      seenOrders.add(id);

      if (sum >= THRESHOLD) {
        const msg = formatOrder(o);
        await sendTelegram(msg);

        console.log("✅ Alert sent:", id);
      }
    }
  } catch (err) {
    console.log("❌ Error:", err.response?.data || err.message);
  }
}

console.log("🚀 RetailCRM Telegram bot started...");

// первый запуск сразу
checkOrders();

// каждые 15 сек
setInterval(checkOrders, 15000);