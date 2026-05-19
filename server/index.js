require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// PostgreSQL Pool Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Routes

// 1. Get all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    // We created a function fn_get_all_tickets()
    const result = await pool.query('SELECT * FROM fn_get_all_tickets()');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error fetching tickets' });
  }
});

// 2. Create a ticket
app.post('/api/tickets', async (req, res) => {
  const { title, description, category, priority, createdBy } = req.body;
  try {
    const result = await pool.query(
      'CALL sp_create_ticket($1, $2, $3, $4, $5, null)',
      [title, description, category, priority, createdBy.id]
    );

    const newId = result.rows[0]?.p_new_ticket_id || result.rows[0]?.[''] || 'unknown';

    res.json({ message: 'Ticket created successfully', id: newId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error creating ticket' });
  }
});

// 3. Assign ticket
app.post('/api/tickets/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { employee } = req.body;
  try {
    await pool.query('CALL sp_assign_ticket($1, $2)', [id, employee.id]);
    res.json({ message: 'Ticket assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error assigning ticket' });
  }
});

// 4. Update ticket status
app.put('/api/tickets/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('CALL sp_update_ticket_status($1, $2)', [id, status]);
    res.json({ message: 'Ticket status updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error updating status' });
  }
});

// 5. Add comment
app.post('/api/tickets/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { message, createdById } = req.body;
  try {
    const result = await pool.query(
      'CALL sp_add_comment($1, $2, $3, null)',
      [id, message, createdById]
    );
    res.json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error adding comment' });
  }
});

// --- SPA Routing Fallback ---
// Serve frontend static files if the Express server is acting as the host
const path = require('path');
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For any other GET request not caught by the API, send back the React index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
