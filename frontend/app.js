const API_URL = "";

let statsInterval = null;

/* ================= REGISTER ================= */

async function register() {
  const email = document.getElementById("regEmail")?.value;
  const password = document.getElementById("regPass")?.value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const res = await fetch(API_URL + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Registration failed");
      return;
    }

    alert("Registered!\nAPI Key:\n" + data.apiKey);

  } catch {
    alert("Server not reachable");
  }
}

/* ================= LOGIN ================= */

async function login() {
  const email = document.getElementById("logEmail")?.value;
  const password = document.getElementById("logPass")?.value;

  try {
    const res = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.apiKey) {
      alert(data.msg || "Login failed");
      return;
    }

    localStorage.setItem("apiKey", data.apiKey);
    window.location.href = "dashboard.html";

  } catch {
    alert("Server not reachable");
  }
}

/* ================= SIDEBAR NAV ================= */

function showSection(section, btn) {

  document.querySelectorAll("main section")
    .forEach(sec => sec.classList.add("hidden"));

  document.getElementById(section + "Section")
    .classList.remove("hidden");

  document.querySelectorAll(".nav-item")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

/* ================= CALL API ================= */

async function callAPI() {
  const btn = document.getElementById("callBtn");
  btn.innerText = "Calling...";
  btn.disabled = true;

  try {
    const apiKey = localStorage.getItem("apiKey");

    const res = await fetch(API_URL + "/proxy/products", {
      headers: { "x-api-key": apiKey }
    });

    const data = await res.json();

    document.getElementById("result").innerText =
      JSON.stringify(data, null, 2);

  } catch {
    document.getElementById("result").innerText =
      "Backend service error";
  }

  btn.innerText = "Call /products";
  btn.disabled = false;
}

/* ================= LOAD STATS ================= */

async function loadStats() {
  try {
    const apiKey = localStorage.getItem("apiKey");

    const res = await fetch(API_URL + "/stats/usage", {
      headers: { "x-api-key": apiKey }
    });

    if (!res.ok) return;

    const data = await res.json();

    const today = data.requestsToday ?? 0;
    const remaining = data.remaining ?? 0;
    const limit = today + remaining || 100;

    document.getElementById("today").innerText = today;
    document.getElementById("remaining").innerText = remaining;

    const percent = Math.min((today / limit) * 100, 100);

    document.getElementById("usagePercent").innerText =
      percent.toFixed(0) + "%";

    document.getElementById("progressBar").style.width =
      percent + "%";

    const logsEl = document.getElementById("logs");
    if (!logsEl) return;

    logsEl.innerHTML = "";

    (data.recent || []).forEach(log => {
      logsEl.innerHTML += `
        <tr>
          <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
          <td>${log.method}</td>
          <td>${log.path}</td>
          <td class="${log.statusCode === 200 ? "ok" : "fail"}">
            ${log.statusCode}
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

/* ================= COPY API KEY ================= */

function copyKey() {
  const key = document.getElementById("apikey").innerText;
  navigator.clipboard.writeText(key);

  const btn = document.getElementById("copyBtn");
  btn.innerText = "Copied ✓";
  btn.disabled = true;

  setTimeout(() => {
    btn.innerText = "Copy";
    btn.disabled = false;
  }, 2000);
}

/* ================= INIT ================= */

window.onload = () => {

  const apiKeyEl = document.getElementById("apikey");

  if (!apiKeyEl) return;

  const apiKey = localStorage.getItem("apiKey");

  if (!apiKey) {
    window.location.href = "index.html";
    return;
  }

  apiKeyEl.innerText = apiKey;

  loadStats();

  if (!statsInterval) {
    statsInterval = setInterval(loadStats, 5000);
  }
};
