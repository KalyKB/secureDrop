const token = localStorage.getItem("token");

if (!token) window.location.href = "Login.html";

const payload = JSON.parse(atob(token.split(".")[1]));
if (payload.role !== "admin") {
  alert("Access denied");
  window.location.href = "Dashboard.html";
}

const tbody = document.getElementById("admin-table-body");
const headers = document.getElementById("admin-table-headers");
let usersVisible = false;
const usersSection = document.getElementById("users-section");

// ===================== USERS =====================
async function loadUsers() {
  const res = await fetch("https://securedrop-production.up.railway.app/api/admin/users", {
    headers: { Authorization: "Bearer " + token }
  });

  const users = await res.json();

  const headerRow = document.getElementById("table-headers");
  headerRow.innerHTML = `
    <th>FIRSTNAME</th>
    <th>EMAIL</th>
    <th>ROLE</th>
    <th>ACTIONS</th>
  `;

  const tbody = document.getElementById("admin-table-body");
  tbody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.firstname}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <select onchange="changeRole('${user._id}', this.value)">
          <option value="uploader" ${user.role === "uploader" ? "selected" : ""}>Uploader</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
        <button onclick="deleteUser('${user._id}', '${user.email}')" style="margin-left:8px;background:#c0392b;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}


// ===================== ACTIONS =====================

async function deleteUser(userId, email) {
  if (!confirm(`Delete user "${email}" and all their files? This cannot be undone.`)) return;

  const res = await fetch(`https://securedrop-production.up.railway.app/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  if (res.ok) {
    loadUsers();
  } else {
    alert("Failed to delete user.");
  }
}

async function changeRole(userId, role) {
  await fetch(`https://securedrop-production.up.railway.app/api/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ role })
  });
  loadUsers();
}






// ===================== BUTTON EVENTS =====================

document.getElementById("view-users-btn")
  .addEventListener("click", async function () {

    usersVisible = !usersVisible;

    if (usersVisible) {
      usersSection.style.display = "block";
      this.textContent = "❌ Hide Users";

      await loadUsers(); // load only when showing
    } else {
      usersSection.style.display = "none";
      this.textContent = "👥 View All Users";
    }
});


document.getElementById("logout-button")
  .addEventListener("click", function () {

    // Remove token
    localStorage.removeItem("token");

    // Optional: clear role if stored
    localStorage.removeItem("role");

    // Redirect to login page
    window.location.href = "Login.html";
});