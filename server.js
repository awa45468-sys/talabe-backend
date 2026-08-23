const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "";

// الاتصال بقاعدة البيانات
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI غير موجود في متغيرات البيئة!');
    return;
  }
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
  } catch (err) {
    console.error('❌ خطأ في الاتصال:', err.message);
  }
}

// النماذج
const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  verificationCode: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const BookSchema = new mongoose.Schema({
  title: String,
  subject: String,
  grade: String,
  year: String,
  pages: Number,
  size: String,
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

// المسارات الأساسية
app.get('/', async (req, res) => {
  await connectDB();
  res.json({ success: true, message: 'منصة طلبتي تعمل بنجاح 🚀' });
});

app.post('/api/send-code', async (req, res) => {
  try {
    await connectDB();
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'رقم الهاتف مطلوب' });
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await User.findOneAndUpdate({ phone }, { verificationCode: code }, { upsert: true, new: true });
    res.json({ success: true, debugCode: code, message: 'تم إرسال الرمز بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/verify-code', async (req, res) => {
  try {
    await connectDB();
    const { phone, code } = req.body;
    const user = await User.findOne({ phone });
    if (user && user.verificationCode === code) {
      res.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    } else {
      res.status(400).json({ success: false, message: 'رمز التحقق غير صحيح' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    await connectDB();
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// تصدير التطبيق لـ Vercel
module.exports = app;
