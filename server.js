const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Load DB
let db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

// Save helper
function saveDB() {
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}
const admin = JSON.parse(fs.readFileSync('./admin.json', 'utf-8'));
// ================= ROUTES =================

// Get all data
app.get('/data', (req, res) => {
    res.json(db);
});

// Submit complaint
app.post('/complaint', (req, res) => {
    const { name, text } = req.body;

    if (!name || !text) {
        return res.status(400).json({ error: "Missing fields" });
    }

    db.complaints.push({
        name,
        text,
        time: Date.now()
    });

    saveDB();
    res.json({ success: true });
});

// Submit review
app.post('/review', (req, res) => {
    const { text, stars } = req.body;

    if (!text || !stars) {
        return res.status(400).json({ error: "Missing fields" });
    }

    db.reviews.push({
        text,
        stars: Number(stars),
        time: Date.now()
    });

    saveDB();
    res.json({ success: true });
});

// Update announcement
app.post('/announcement', (req, res) => {
    const { text } = req.body;

    db.announcement = text || "";
    saveDB();

    res.json({ success: true });
});

// Delete complaint
app.post('/delete', (req, res) => {
    const { index } = req.body;

    if (index === undefined) {
        return res.status(400).json({ error: "Index required" });
    }

    db.complaints.splice(index, 1);
    saveDB();

    res.json({ success: true });
});

// ================= START =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
