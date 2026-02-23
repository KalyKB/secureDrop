const cancelButton = document.getElementById("cancel-button");
const logoLink = document.getElementById("logo-link");
const uploadButton = document.getElementById("upload-button");

if (cancelButton) {
    cancelButton.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}

if (logoLink) {
    logoLink.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}

if (uploadButton) {
    uploadButton.addEventListener("click", () => {
        window.location.href = "upload.html";
    });
}


// Detect pages
const uploadBtn = document.getElementById("upload-button");
const fileInput = document.getElementById("file-input");
const browseLink = document.getElementById("browse-link");
const fileNameDisplay = document.getElementById("file-name");

if (fileInput && fileNameDisplay) {
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    }
  });
}

if (browseLink && fileInput) {

  browseLink.addEventListener("click", function (e) {
    e.preventDefault();        // prevent page jump
    fileInput.click();         // open file dialog
  });

}

// Store files in browser memory
let files = JSON.parse(localStorage.getItem("files")) || [];

/* =========================
   UPLOAD PAGE FUNCTIONALITY
========================= */

if (uploadBtn && fileInput) {

  uploadBtn.addEventListener("click", () => {
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const fileData = {
      name: file.name,
      size: formatFileSize(file.size),
      date: new Date().toLocaleDateString(),
      data: URL.createObjectURL(file)
    };

    files.push(fileData);
    localStorage.setItem("files", JSON.stringify(files));

    window.location.href = "Dashboard.html";
  });
}

/* =========================
   DASHBOARD PAGE FUNCTIONALITY
========================= */

const tableBody = document.querySelector(".file-table tbody");

if (tableBody) {
  renderFiles();
}

function renderFiles() {
  tableBody.innerHTML = "";

  files.forEach((file, index) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${file.name}</td>
      <td>${file.size}</td>
      <td>${file.date}</td>
      <td class="actions">
        <button class="icon-button download-btn" data-index="${index}">
          <svg
                 xmlns="http://www.w3.org/2000/svg"
                 height="24px"
                 viewBox="0 -960 960 960"
                 width="24px"
            >
                <path
                    d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
                />
            </svg>
        </button>
        <button class="icon-button delete-btn" data-index="${index}">
          <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
            >
                <path
                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                />
            </svg>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachEvents();
}

function attachEvents() {

  document.querySelectorAll(".download-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      const file = files[index];

      const link = document.createElement("a");
      link.href = file.data;
      link.download = file.name;
      link.click();
    });
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;

      files.splice(index, 1);
      localStorage.setItem("files", JSON.stringify(files));

      renderFiles();
    });
  });
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}