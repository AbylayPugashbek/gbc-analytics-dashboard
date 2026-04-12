require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.RETAILCRM_API_KEY;
const BASE_URL = process.env.RETAILCRM_URL;

async function createOrder() {
  const order = {
    externalId: String(Date.now()),

    firstName: "Aigul",
    lastName: "Kasimova",
    phone: "+77001234501",
    email: "aigul.kasymova@example.com",

    orderMethod: "shopping-cart",
    status: "new",

    items: [
      {
        productName: "Корректирующее бельё Nova Classic",
        quantity: 1,
        initialPrice: 60000
      }
    ],

    delivery: {
      address: {
        city: "Almaty",
        text: "ul. Abaya 150, kv 12"
      }
    },

    customFields: [
      {
        code: "utm_source",
        value: "instagram"
      }
    ]
  };

  const params = new URLSearchParams();
  params.append("order", JSON.stringify(order));
  params.append("apiKey", API_KEY);

  try {
    const res = await axios.post(
      `${BASE_URL}/orders/create`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log("✅ CREATED:", res.data);
  } catch (err) {
    console.log("❌ ERROR:", err.response?.data || err.message);
  }
}

createOrder();