require("dotenv").config();

const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const RETAIL_URL = process.env.RETAILCRM_URL;
const API_KEY = process.env.RETAILCRM_API_KEY;

async function fetchOrders() {
  const res = await axios.get(`${RETAIL_URL}/orders`, {
    params: {
      apiKey: API_KEY,
    },
  });

  return res.data.orders || [];
}

function transform(order) {
  const items = order.items || [];

  const total = items.reduce(
    (sum, i) => sum + (i.initialPrice || 0) * (i.quantity || 1),
    0
  );

  return {
    id: String(order.id),
    number: order.number,
    status: order.status,
    total_sum: total,
    created_at: order.createdAt || new Date().toISOString(),
    customer_name: order.customer?.firstName || "Unknown",
    phone: order.customer?.phones?.[0]?.number || null,
    email: order.customer?.email || null,
  };
}

async function sync() {
  try {
    const orders = await fetchOrders();

    console.log(`📦 Fetched: ${orders.length}`);

    for (const order of orders) {
      const data = transform(order);

      const { error } = await supabase
        .from("orders")
        .upsert(data, { onConflict: "id" });

      if (error) {
        console.error("❌ Supabase error:", error.message);
      } else {
        console.log("✅ Synced:", data.id);
      }
    }
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
  }
}

sync();