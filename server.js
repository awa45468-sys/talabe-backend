const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "";

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!MONGO_URI) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
  } catch (err) {
    console.error(err);
  }
}

app.get('/', async (req, res) => {
  await connectDB();
  res.json({ success: true, message: 'منصة طلبتي تعمل بنجاح 🚀' });
});

app.post('/api/send-code', async (req, res) => {
  res.json({ success: true, message: 'تم استلام الطلب بنجاح' });
});

module.exports = app;
