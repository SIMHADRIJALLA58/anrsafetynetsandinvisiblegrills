async function register() {
  let name = document.getElementById("reg_name").value;
  let pin = document.getElementById("reg_pin").value;

  let res = await fetch("/api/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, pin})
  });
  let data = await res.json();
  document.getElementById("reg_msg").innerText = JSON.stringify(data);
}

async function login() {
  let account_number = document.getElementById("login_acc").value;
  let pin = document.getElementById("login_pin").value;

  let res = await fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({account_number, pin})
  });
  let data = await res.json();
  if (res.ok) {
    localStorage.setItem("name", data.name);
    localStorage.setItem("balance", data.balance);
    window.location.href = "/dashboard.html";
  } else {
    document.getElementById("login_msg").innerText = data.error;
  }
}

async function getBalance() {
  let res = await fetch("/api/balance");
  let data = await res.json();
  document.getElementById("balance").innerText = data.balance;
}

async function logout() {
  await fetch("/api/logout", {method: "POST"});
  window.location.href = "/";
}

// Load user info on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  document.getElementById("welcome").innerText =
    "Welcome " + (localStorage.getItem("name") || "");
  document.getElementById("balance").innerText =
    localStorage.getItem("balance") || "0";
}
