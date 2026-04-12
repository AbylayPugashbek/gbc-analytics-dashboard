async function loadData() {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?select=*`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();
  console.log("DATA:", data);

  // KPI
  const revenue = data.reduce((s, o) => s + (o.total_sum || 0), 0);
  const orders = data.length;
  const avg = orders ? revenue / orders : 0;

  document.getElementById("revenue").innerText =
    `₸ ${revenue.toLocaleString()}`;

  document.getElementById("orders").innerText =
    orders.toLocaleString();

  document.getElementById("avg").innerText =
    `₸ ${avg.toFixed(0).toLocaleString()}`;

  // GROUP BY DATE
  const grouped = {};

  data.forEach(o => {
    const date = new Date(o.created_at).toISOString().split("T")[0];
    grouped[date] = (grouped[date] || 0) + (o.total_sum || 0);
  });

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  // CHART (SaaS STYLE)
  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Revenue",
        data: values,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#cbd5e1" }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => "₸ " + ctx.parsed.y.toLocaleString()
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          ticks: {
            color: "#94a3b8",
            callback: (v) => "₸ " + v
          },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });
}

loadData();