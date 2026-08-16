const API = "https://echo-x-support.onrender.com"; // 🔥 replace this

const loader = document.getElementById("loader");

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

// Load saved theme
(function () {
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.body.classList.add("light");
})();

// ===== LOADING BAR =====
function startLoad() {
    loader.style.display = "block";
}
function stopLoad() {
    loader.style.display = "none";
}

// ===== LOAD DATA =====
async function load() {
    try {
        startLoad();

        const res = await fetch(API + "/data");
        const data = await res.json();

        // Announcement
        document.getElementById("announcement").innerText = data.announcement || "Welcome";

        // Stats
        const total = data.reviews.length;
        const avg = total
            ? (data.reviews.reduce((a, b) => a + b.stars, 0) / total).toFixed(1)
            : 0;

        document.getElementById("avgRating").innerText = avg;
        document.getElementById("totalReviews").innerText = total;

        // Reviews render
        const container = document.getElementById("reviews");

        container.innerHTML = data.reviews
            .slice()
            .reverse()
            .map(r => `
                <div class="review">
                    <b>${"★".repeat(r.stars)}</b>
                    <p>${escapeHTML(r.text)}</p>
                </div>
            `).join("");

    } catch (err) {
        console.error(err);
    } finally {
        stopLoad();
    }
}

// ===== SEND COMPLAINT =====
async function sendComplaint() {
    const name = document.getElementById("name").value.trim();
    const text = document.getElementById("complaint").value.trim();

    if (!name || !text) return alert("Fill all fields");

    startLoad();

    await fetch(API + "/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text })
    });

    document.getElementById("complaint").value = "";

    stopLoad();
}

// ===== SEND REVIEW =====
async function sendReview() {
    const text = document.getElementById("reviewText").value.trim();
    const stars = parseInt(document.getElementById("stars").value);

    if (!text) return alert("Write something");

    startLoad();

    await fetch(API + "/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, stars })
    });

    document.getElementById("reviewText").value = "";

    await load(); // refresh UI
}

// ===== ESCAPE (SECURITY) =====
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[m]);
}

// ===== AUTO REFRESH =====
setInterval(load, 10000); // refresh every 10s

// ===== INIT =====
load();
