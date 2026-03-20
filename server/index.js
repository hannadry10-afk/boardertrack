require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Generic CRUD helper ───────────────────────────────────────────────────

function makeRoutes(app, tableName, jsonFields = []) {

  // Parse JSON fields from DB row
  function parseRow(row) {
    if (!row) return row;
    jsonFields.forEach(f => {
      if (row[f] && typeof row[f] === 'string') {
        try { row[f] = JSON.parse(row[f]); } catch {}
      }
    });
    return row;
  }

  // Stringify JSON fields before saving
  function prepareData(data) {
    const d = { ...data };
    jsonFields.forEach(f => {
      if (d[f] && typeof d[f] === 'object') {
        d[f] = JSON.stringify(d[f]);
      }
    });
    return d;
  }

  const base = `/api/entities/${tableName}`;

  // LIST all
  app.get(base, (req, res) => {
    try {
      const rows = db.prepare(`SELECT * FROM ${tableName} ORDER BY created_date DESC`).all();
      res.json({ records: rows.map(parseRow), count: rows.length });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // FILTER
  app.get(`${base}/filter`, (req, res) => {
    try {
      const conditions = [];
      const values = [];
      Object.entries(req.query).forEach(([k, v]) => {
        conditions.push(`${k} = ?`);
        values.push(v);
      });
      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      const rows = db.prepare(`SELECT * FROM ${tableName} ${where} ORDER BY created_date DESC`).all(...values);
      res.json({ records: rows.map(parseRow), count: rows.length });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // GET by ID
  app.get(`${base}/:id`, (req, res) => {
    try {
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(parseRow(row));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // CREATE
  app.post(base, (req, res) => {
    try {
      const data = prepareData(req.body);
      const id = uuidv4();
      const now = new Date().toISOString();
      const fields = ['id', ...Object.keys(data), 'created_date', 'updated_date'];
      const values = [id, ...Object.values(data), now, now];
      const placeholders = fields.map(() => '?').join(', ');
      db.prepare(`INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`).run(...values);
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
      res.status(201).json(parseRow(row));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // UPDATE
  app.put(`${base}/:id`, (req, res) => {
    try {
      const data = prepareData(req.body);
      const now = new Date().toISOString();
      const sets = [...Object.keys(data).map(k => `${k} = ?`), 'updated_date = ?'];
      const values = [...Object.values(data), now, req.params.id];
      db.prepare(`UPDATE ${tableName} SET ${sets.join(', ')} WHERE id = ?`).run(...values);
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      res.json(parseRow(row));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // DELETE
  app.delete(`${base}/:id`, (req, res) => {
    try {
      db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(req.params.id);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
}

// ─── Register routes for all entities ─────────────────────────────────────
makeRoutes(app, 'boarders');
makeRoutes(app, 'settings', ['summary_overrides']);
makeRoutes(app, 'expenses');
makeRoutes(app, 'activity_log', ['old_values', 'new_values']);

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'BoarderTrack API running 🏘️' }));

app.listen(PORT, () => {
  console.log(`🚀 BoarderTrack server running at http://localhost:${PORT}`);
});
