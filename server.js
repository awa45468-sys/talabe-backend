const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// الاتصال بقاعدة البيانات
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة بيانات MongoDB Atlas بنجاح!'))
  .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message));

// --- 1. نماذج قاعدة البيانات (Schemas) ---

// نموذج المستخدمين والتحقق
const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  verificationCode: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

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
const Book = mongoose.model('Book', BookSchema);

// نموذج المرشحات الوزارية
const FilterSchema = new mongoose.Schema({
  title: String,
  category: String,
  year: String,
  createdAt: { type: Date, default: Date.now }
});
const Filter = mongoose.model('Filter', FilterSchema);


// --- 2. مسارات المصادقة (Authentication) ---
app.post('/api/send-code', async (req, res) => {
  try {
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


// --- 3. مسارات الكتب (Books API) ---
// جلب كل الكتب
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// إضافة كتاب جديد (من لوحة التحكم)
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.json({ success: true, message: 'تم إضافة الكتاب بنجاح', book: newBook });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// --- 4. مسارات المرشحات (Filters API) ---
app.get('/api/filters', async (req, res) => {
  try {
    const filters = await Filter.find().sort({ createdAt: -1 });
    res.json({ success: true, filters });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/filters', async (req, res) => {
  try {
    const newFilter = new Filter(req.body);
    await newFilter.save();
    res.json({ success: true, message: 'تم إضافة المرشح بنجاح', filter: newFilter });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// --- 5. مسارات لوحة التحكم (Admin Stats API) ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalFilters = await Filter.countDocuments();

    res.json({
      success: true,
      stats: {
        students: totalStudents + 50250, // دمج العدد الافتراضي مع المسجلين
        books: totalBooks,
        filters: totalFilters + 120,
        sales: "125,500"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل الآن على البورت: ${PORT}`);
});
