const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.json({ message: '🚀 سيرفر تطبيق طلبتي يعمل بنجاح!' });
});

app.post('/api/auth/register', async (req, res) => {
  const { phone, password, full_name, gender, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      `INSERT INTO users (phone, password_hash, full_name, gender, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, phone, full_name, role`,
      [phone, hashedPassword, full_name, gender, role || 'student']
    );
    const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET || 'secret');
    res.json({ user: newUser.rows[0], token });
  } catch (err) {
    res.status(400).json({ error: 'رقم الهاتف مسجل بالفعل أو يوجد خطأ بالبيانات' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (user.rows.length === 0) return res.status(400).json({ error: 'المستخدم غير موجود' });
    
    const validPass = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPass) return res.status(400).json({ error: 'كلمة المرور غير صحيحة' });

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET || 'secret');
    res.json({ user: { id: user.rows[0].id, full_name: user.rows[0].full_name, role: user.rows[0].role }, token });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
