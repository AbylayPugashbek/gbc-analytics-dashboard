require("dotenv").config();

const axios = require("axios");
const fs = require("fs");

const API_KEY = process.env.RETAILCRM_API_KEY;
const BASE_URL = process.env.RETAILCRM_URL;

const orders = JSON.parse(fs.readFileSync("./mock_orders.json", "utf-8"));

async function uploadOrders() {
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];

    try {
      const totalSumm = order.items.reduce(
        (sum, item) => sum + item.initialPrice * item.quantity,
        0
      );

      await axios.post(
        `${BASE_URL}/orders/create`,
        {
          order: JSON.stringify({
            externalId: String(index + 1),

            firstName: order.firstName,
            lastName: order.lastName,
            phone: order.phone,
            email: order.email,

            // orderType: order.orderType,
            orderMethod: order.orderMethod,
            status: order.status,

            items: order.items.map(item => ({
              productName: item.productName,
              quantity: item.quantity,
              initialPrice: item.initialPrice
            })),

            delivery: {
              address: {
                city: order.delivery?.address?.city,
                text: order.delivery?.address?.text
              }
            },

            totalSumm: totalSumm,
            site: "almaty"
          })
        },
        {
          params: { apiKey: API_KEY }
        }
      );

      console.log("✅ Uploaded:", index + 1);
    } catch (error) {
      const msg = error.response?.data?.errorMsg;

      if (msg === "Order already exists.") {
        console.log("⚠️ Already exists:", index + 1);
      } else {
        console.error("❌ Error:", index + 1, error.response?.data || error.message);
      }
    }
  }
}

uploadOrders();