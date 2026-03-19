const token = localStorage.getItem("token");

if (!token) window.location.href = "Login.html";

const payload = JSON.parse(atob(token.split(".")[1]));
if (payload.role !== "admin") {
  alert("Access denied");
  window.location.href = "Dashboard.html";
}

const tbody = document.getElementById("admin-table-body");
const headers = document.getElementById("admin-table-headers");

// ===================== USERS =====================
async function loadUsers() {
  const res = await fetch("http://localhost:5000/api/admin/users", {
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
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ===================== FILES =====================
async function loadFiles() {
  const res = await fetch("http://localhost:5000/api/admin/files", {
    headers: { Authorization: "Bearer " + token }
  });

  const files = await res.json();

  const headerRow = document.getElementById("table-headers");
  headerRow.innerHTML = `
    <th>FILENAME</th>
    <th>EMAIL</th>
    <th>DATE</th>
    <th>ACTIONS</th>
  `;

  const tbody = document.getElementById("admin-table-body");
  tbody.innerHTML = "";

  files.forEach(file => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${file.originalName}</td>
      <td>${file.uploadedBy?.email || "Unknown"}</td>
      <td>${new Date(file.createdAt).toLocaleString()}</td>
      <td class="actions">
        <button class="icon-button download-btn"
                data-id="${file._id}"
                data-name="${file.originalName}">
          <img src="download_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
                alt="Download"
                width="24" height="24">
        </button>

        <button class="icon-button delete-btn"
                data-id="${file._id}">
          <img src="delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
                alt="Delete"
                width="24" height="24">
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

document.getElementById("logout-button")
  .addEventListener("click", function () {

    // Remove token
    localStorage.removeItem("token");

    // Optional: clear role if stored
    localStorage.removeItem("role");

    // Redirect to login page
    window.location.href = "login.html";
});
// ===================== ACTIONS =====================

async function changeRole(userId, role) {
  await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ role })
  });
  loadUsers();
}

async function deleteUser(userId) {
  if (!confirm("Delete this user?")) return;

  await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadUsers();
}

async function deleteFile(fileId) {
  if (!confirm("Delete this file?")) return;

  await fetch(`http://localhost:5000/api/admin/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadFiles();
}

//download

async function downloadFile(fileId, originalName) {

  const response = await fetch(
    `http://localhost:5000/api/files/${fileId}`,
    {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );

  if (!response.ok) {
    alert("Download failed");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = originalName;
  // 👇 DO NOT set a.download manually
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}
// ===================== BUTTON EVENTS =====================

document.getElementById("view-users-btn")
  .addEventListener("click", loadUsers);

document.getElementById("view-files-btn")
  .addEventListener("click", loadFiles);

loadUsers();


document.addEventListener("click", function (e) {

    const button = e.target.closest("button");
    if (!button) return;

    const fileId = button.dataset.id;

    if (button.classList.contains("download-btn")) {
        const originalName = button.dataset.name;
        downloadFile(fileId, originalName);
    }

    if (button.classList.contains("delete-btn")) {
        deleteFile(fileId);
    }
});