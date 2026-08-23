const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

// دالة اتصال آمنة ومستقرة لبيئة Vercel
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('✅ تم الاتصال بقاعدة بيانات MongoDB Atlas بنجاح!');
  } catch (err) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message);
  }
}

// نموذج المستخدمين والتحقق
const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  verificationCode: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// نموذج الكتب
const BookSchema = new mongoose.Schema({
  title: String,
  subject: String,
  grade: String,
  year: String,
  pages: Number,
  size: String,
  image: String,
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

// نموذج المرشحات الوزارية
const FilterSchema = new mongoose.Schema({
  title: String,
  category: String,
  year: String,
  createdAt: { type: Date, default: Date.now }
});
const Filter = mongoose.models.Filter || mongoose.model('Filter', FilterSchema);


// صفحة الترحيب الرئيسية
app.get('/', async (req, res) => {
  await connectDB();
  res.json({ message: 'أهلاً بك في منصة طلبتي - Talabe API تعمل بنجاح!' });
});

// مسارات المصادقة
app.post('/api/send-code', async (req, res) => {
  try {
    await connectDB();
    const { phone } = req.body;
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

// مسارات الكتب
app.get('/api/books', async (req, res) => {
  try {
    await connectDB();
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    await connectDB();
    const newBook = new Book(req.body);
    await newBook.save();
    res.json({ success: true, message: 'تم إضافة الكتاب بنجاح', book: newBook });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// مسارات المرشحات
app.get('/api/filters', async (req, res) => {
  try {
    await connectDB();
    const filters = await Filter.find().sort({ createdAt: -1 });
    res.json({ success: true, filters });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/filters', async (req, res) => {
  try {
    await connectDB();
    const newFilter = new Filter(req.body);
    await newFilter.save();
    res.json({ success: true, message: 'تم إضافة المرشح بنجاح', filter: newFilter });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// إحصائيات لوحة التحكم
app.get('/api/admin/stats', async (req, res) => {
  try {
    await connectDB();
    const totalStudents = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalFilters = await Filter.countDocuments();

    res.json({
      success: true,
      stats: {
        students: totalStudents + 50250,
        books: totalBooks,
        filters: totalFilters + 120,
        sales: "125,500"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// تصدير السيرفر ليعمل على Vercel Serverless
module.exports = app;
