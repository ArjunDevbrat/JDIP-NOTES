
const API_BASE = "http://localhost:5000/api/notes";
const AUTH_BASE = "http://localhost:5000/api/auth";


document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !password)
    return alert("⚠️ Please fill all fields.");

  try {
    const res = await fetch(`${AUTH_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const result = await res.json();
    if (res.ok) {
      alert(result.message || "✅ Registration successful!");
      window.location.href = "login.html";
    } else alert("❌ " + (result.error || "Registration failed."));
  } catch (err) {
    alert("⚠️ Server connection error.");
  }
});


document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("⚠️ Please fill both fields.");

  try {
    const res = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();

    if (res.ok) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      alert("✅ Login successful!");
      window.location.href = "upload.html";
    } else alert("❌ " + (result.error || "Invalid credentials."));
  } catch (err) {
    alert("⚠️ Unable to connect to server.");
  }
});


document.getElementById("uploadForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user) return alert("⚠️ Please login first.");

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("subject", document.getElementById("subject").value);
  formData.append("department", document.getElementById("department").value);
  formData.append("file", document.getElementById("file").files[0]);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await res.json();
    if (res.ok) {
      alert("✅ Note uploaded successfully!");
      document.getElementById("uploadForm").reset();
    } else alert("❌ Upload failed: " + (result.error || result.message));
  } catch (err) {
    alert("⚠️ Error uploading note.");
  }
});



async function loadAllNotes() {
  const list = document.getElementById("notesList");
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/all`);
    const notes = await res.json();

    if (notes.length === 0) {
      list.innerHTML = `<p class="text-center text-light mt-3">📂 No materials uploaded yet.</p>`;
      return;
    }

    list.innerHTML = notes
      .map(
        (note) => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card notes-card shadow h-100 bg-white text-dark">
          <div class="card-body">
            <h5 class="card-title"><i class="fas fa-file-alt"></i> ${note.title}</h5>
            <p>${note.description}</p>
            <p class="text-muted"><i class="fas fa-book"></i> ${note.subject} | 
            <i class="fas fa-graduation-cap"></i> ${note.department}</p>
            <a href="http://localhost:5000/${note.filePath}" class="btn btn-primary w-100" target="_blank">
              <i class="fas fa-download"></i> Download
            </a>
          </div>
        </div>
      </div>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading all notes:", err);
    list.innerHTML = `<p class="text-danger text-center mt-3">⚠️ Unable to load notes.</p>`;
  }
}

if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/")
  window.onload = loadAllNotes;

console.log("✅ JDIP Script running locally on localhost:5000");
