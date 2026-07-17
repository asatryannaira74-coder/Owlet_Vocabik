const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
  store: new pgSession({ pool, tableName: 'session' }),
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 oր
}));

// --- Գրանցում ---
// Մարմին՝ { name, pin, grade, parentEmail (ոչ պարտադիր) }
app.post('/api/register', async (req, res) => {
  try {
    const { name, pin, grade, parentEmail } = req.body;
    if (!name || !pin || !grade) {
      return res.status(400).json({ error: 'Անունը, PIN-ը և դասարանը պարտադիր են' });
    }
    if (pin.length < 4) {
      return res.status(400).json({ error: 'PIN-ը պետք է լինի առնվազն 4 նիշ' });
    }
    const pinHash = await bcrypt.hash(pin, 10);
    const result = await pool.query(
      'INSERT INTO users (name, pin_hash, grade, parent_email) VALUES ($1, $2, $3, $4) RETURNING id, name, grade',
      [name.trim(), pinHash, grade, parentEmail || null]
    );
    const user = result.rows[0];
    req.session.userId = user.id;
    res.json({ success: true, user: { id: user.id, name: user.name, grade: user.grade } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Գրանցման սխալ' });
  }
});

// --- Մուտք ---
// Մարմին՝ { name, pin }
app.post('/api/login', async (req, res) => {
  try {
    const { name, pin } = req.body;
    if (!name || !pin) {
      return res.status(400).json({ error: 'Անունը և PIN-ը պարտադիր են' });
    }
    const result = await pool.query('SELECT * FROM users WHERE name = $1', [name.trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Օգտատերը չի գտնվել' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(pin, user.pin_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Սխալ PIN' });
    }
    req.session.userId = user.id;
    res.json({ success: true, user: { id: user.id, name: user.name, grade: user.grade } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Մուտքի սխալ' });
  }
});

// --- Ընթացիկ օգտատիրոջ ստուգում ---
app.get('/api/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Մուտք չի կատարվել' });
  }
  try {
    const result = await pool.query('SELECT id, name, grade FROM users WHERE id = $1', [req.session.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Օգտատերը չի գտնվել' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Սխալ' });
  }
});

// --- Ելք ---
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// --- Առաջընթացի պահպանում ---
// Մարմին՝ { grade, lessonId, completedCount }
app.post('/api/progress', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Մուտք չի կատարվել' });
  }
  try {
    const { grade, lessonId, completedCount } = req.body;
    await pool.query(
      `INSERT INTO progress (user_id, grade, lesson_id, completed_count, last_played_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, grade, lesson_id)
       DO UPDATE SET completed_count = GREATEST(progress.completed_count, $4), last_played_at = NOW()`,
      [req.session.userId, grade, lessonId, completedCount || 1]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Սխալ առաջընթացը պահպանելիս' });
  }
});

// --- Առաջընթացի ստացում ---
app.get('/api/progress/:grade', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Մուտք չի կատարվել' });
  }
  try {
    const result = await pool.query(
      'SELECT lesson_id, completed_count FROM progress WHERE user_id = $1 AND grade = $2',
      [req.session.userId, req.params.grade]
    );
    res.json({ progress: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Սխալ' });
  }
});

app.listen(PORT, () => {
  console.log(`Սերվերը աշխատում է պորտ ${PORT}-ի վրա`);
});
