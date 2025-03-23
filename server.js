const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

const dbPath = path.join(__dirname, "animeDatenbank.db");
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    } else {
        console.log("Verbindung zur SQLite-Datenbank hergestellt.");
    }
});

app.get("/api/data", (req, res) => {
    const view = req.query.view;

    // Erlaubte Views definieren (nur diese dürfen abgefragt werden)
    const allowedViews = {
        view1: "SELECT * FROM animeAnsicht;",
        view2: "SELECT * FROM charakterAnsicht;",
        view3: "SELECT * FROM CharakterBeziehungen;",
        view4: "SELECT * FROM charaktere;"
    };

    if (!allowedViews[view]) {
        return res.status(400).json({ error: "Ungültiger View" });
    }

    db.all(allowedViews[view], [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);  // Die gesamte Ergebnismenge zurückgeben, ohne Paging
    });
});

app.use(express.static(path.join(__dirname, '/')));

app.listen(3000, () => {
    console.log("Server läuft auf http://localhost:3000");
});
