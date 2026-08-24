const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. إعدادات الاتصال بقاعدة البيانات (Supabase / MongoDB / Neon)
// ==========================================
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// ==========================================
// 2. معلومات الدفع المعتمدة (زين كاش وآسيا حوالة 07734378998)
// ==========================================
const PAYMENT_INFO = {
  zainCash: "07734378998",
  rafidainCard: "910160728184",
  rasheedCard: "6281 0000 0000 0000",
  asiaHawala: "07734378998",
  price: "10,000 د.ع",
  supportPhone: "07734378998"
};

// ==========================================
// 3. قاعدة بيانات الملازم والمناهج (سعر كل ملزمة 10,000 د.ع)
// ==========================================
const booksData = [
  { id: 1, title: 'الرياضيات - الثالث متوسط', category: 'الرياضيات', price: '10,000 د.ع', pages: '240 صفحة', desc: 'المنهج الكامل مع حلول التمارين والأسئلة الوزارية المعتمدة 2026.' },
  { id: 2, title: 'اللغة العربية - الثالث متوسط', category: 'اللغة العربية', price: '10,000 د.ع', pages: '210 صفحة', desc: 'شامل القواعد، الأدب والنصوص والإنشاء مع نماذج وزارية.' },
  { id: 3, title: 'اللغة الإنجليزية - English for Iraq', category: 'اللغة الإنجليزية', price: '10,000 د.ع', pages: '190 صفحة', desc: 'القواعد والقطع الاستيعابية والإنشاءات والتمارين الوزارية المترجمة.' },
  { id: 4, title: 'الكيمياء - الثالث متوسط', category: 'الكيمياء', price: '10,000 د.ع', pages: '170 صفحة', desc: 'المعادلات، المسائل الحسابية، والكشوفات الوزارية المضمونة.' },
  { id: 5, title: 'الفيزياء - الثالث متوسط', category: 'الفيزياء', price: '10,000 د.ع', pages: '185 صفحة', desc: 'شرح القوانين الرياضية، ربط المقاومات، والمسائل المكررة وزارياً.' },
  { id: 6, title: 'الأحياء - الثالث متوسط', category: 'الأحياء', price: '10,000 د.ع', pages: '195 صفحة', desc: 'ملخص أجهزة جسم الإنسان مع كافة الرسومات والمخططات المطلوبة.' },
  { id: 7, title: 'الاجتماعيات - الثالث متوسط', category: 'الاجتماعيات', price: '10,000 د.ع', pages: '220 صفحة', desc: 'التاريخ، الجغرافيا، والتربية الوطنية مع حلول الخرائط والتعاليل.' },
  { id: 8, title: 'التربية الإسلامية - الثالث متوسط', category: 'التربية الإسلامية', price: '10,000 د.ع', pages: '140 صفحة', desc: 'أحكام التلاوة، تفسير السور، والأحاديث النبوية الشريفة.' },
  { id: 9, title: 'العلوم - الثالث متوسط', category: 'العلوم', price: '10,000 د.ع', pages: '200 صفحة', desc: 'شامل ومكثف لجميع الوحدات التعليمية مع حلول أسئلة الفصول.' }
];

// أكواد التفعيل المعتمدة
let activationCodes = [
  { code: 'TAL-VIP-2026', bookId: 'all', isUsed: false, student: 'طالب VIP' },
  { code: 'TAL-MATH-98', bookId: 1, isUsed: false, student: 'علي حسن' },
  { code: 'TAL-ARAB-77', bookId: 2, isUsed: false, student: 'زينب أحمد' }
];

// الطلبات المسجلة
let orders = [];

// ==========================================
// 4. مسارات API (Endpoints)
// ==========================================

// جلب الكتب
app.get('/api/books', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('books').select('*');
      if (!error && data && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json(booksData);
});

// معلومات الدفع
app.get('/api/payment-info', (req, res) => {
  res.json(PAYMENT_INFO);
});

// تفعيل كود
app.post('/api/redeem-code', (req, res) => {
  const { code, student_name } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'يرجى إدخال الكود' });

  const found = activationCodes.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!found) return res.status(404).json({ success: false, message: 'كود التفعيل غير صالح' });
  if (found.isUsed) return res.status(400).json({ success: false, message: 'تم استخدام هذا الكود سابقاً' });

  found.isUsed = true;
  found.usedBy = student_name || 'طالب';

  res.json({
    success: true,
    message: 'تم تفعيل وفتح المادة بنجاح 🎓',
    bookId: found.bookId
  });
});

// تسجيل طلب شراء ملزمة
app.post('/api/orders', async (req, res) => {
  const { student_name, phone, book_title, payment_method, transaction_ref, governorate } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, message: 'يرجى إكمال بيانات التحويل ورقم الوصل' });
  }

  const newOrder = {
    id: 'ORD-' + Date.now(),
    student_name,
    phone,
    governorate: governorate || 'العراق',
    book_title,
    payment_method,
    transaction_ref,
    price: '10,000 د.ع',
    status: 'قيد التحقق',
    created_at: new Date().toISOString()
  };

  orders.push(newOrder);

  if (supabase) {
    try {
      await supabase.from('orders').insert([newOrder]);
    } catch (e) {}
  }

  res.json({
    success: true,
    message: 'تم إرسال طلبك بنجاح! سيتم إرسال كود التفعيل لك فور تأكيد الحوالة.'
  });
});

// ==========================================
// 5. واجهة HTML التفاعلية المباشرة (تعمل بدون أخطاء 404 على Vercel و GitHub)
// ==========================================
app.get('*', (req, res) => {
  const booksCards = booksData.map(b => `
    <div class="book-card">
      <span class="category-badge">${b.category} • 10,000 د.ع</span>
      <h3 class="book-title">${b.title}</h3>
      <p class="book-desc">${b.desc}</p>
      <div class="book-footer">
        <span class="price-tag">10,000 د.ع</span>
        <button onclick="openPaymentModal('${b.title}')" class="btn-lock">فتح المادة (10,000 د.ع) 🔒</button>
      </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>منصة طلبتي التعليمية | المناهج والملازم الوزارية 2026</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', sans-serif; }
    body { background: #0b0f19; color: #f1f5f9; padding: 20px 15px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .header { text-align: center; margin: 25px 0 35px; }
    .header h1 { font-size: 2.3rem; font-weight: 900; color: #60a5fa; margin-bottom: 8px; }
    .header p { color: #94a3b8; font-size: 1rem; }
    .banner { background: linear-gradient(135deg, #1e1b4b, #2563eb); border-radius: 24px; padding: 25px; margin-bottom: 35px; text-align: center; border: 1px solid #3b82f6; box-shadow: 0 10px 30px -10px rgba(37,99,235,0.4); }
    .banner h2 { font-size: 1.5rem; font-weight: 900; margin-bottom: 10px; color: #fff; }
    .banner p { color: #dbeafe; font-size: 0.95rem; margin-bottom: 12px; }
    .badge-phone { display: inline-block; background: rgba(0,0,0,0.4); border: 1px solid #60a5fa; color: #93c5fd; padding: 6px 16px; border-radius: 999px; font-weight: bold; font-family: monospace; font-size: 0.95rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .book-card { background: #131b2e; border: 1px solid #1e293b; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
    .category-badge { background: #1e3a8a; color: #93c5fd; font-size: 0.75rem; font-weight: bold; padding: 4px 10px; border-radius: 8px; align-self: flex-start; margin-bottom: 12px; }
    .book-title { font-size: 1.15rem; font-weight: 900; color: #fff; margin-bottom: 8px; }
    .book-desc { font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 20px; }
    .book-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #1e293b; padding-top: 15px; }
    .price-tag { font-size: 1.1rem; font-weight: 900; color: #34d399; }
    .btn-lock { background: #d97706; hover: background #b45309; color: #fff; border: none; padding: 8px 16px; border-radius: 12px; font-weight: bold; font-size: 0.85rem; cursor: pointer; }
    .modal-bg { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); z-index: 100; align-items: center; justify-content: center; padding: 15px; }
    .modal-box { background: #131b2e; border: 1px solid #334155; border-radius: 24px; padding: 25px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
    .form-inp { width: 100%; padding: 12px; border-radius: 12px; background: #0b0f19; border: 1px solid #334155; color: #fff; margin-bottom: 12px; font-size: 0.9rem; outline: none; }
    .btn-pay { width: 100%; background: #2563eb; color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 900; font-size: 1rem; cursor: pointer; }
    .btn-wa { display: block; text-align: center; text-decoration: none; background: #16a34a; color: #fff; padding: 12px; border-radius: 12px; font-weight: bold; font-size: 0.9rem; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 منصة طلبتي التعليمية</h1>
      <p>المناهج والملازم المعتمدة وزارياً لطلاب العراق 2026</p>
    </div>

    <div class="banner">
      <h2>جميع المواد مقفلة • سعر تفعيل أي مادة 10,000 د.ع فقط 🔒</h2>
      <p>يتم إرسال كود التفعيل فوراً عبر الواتساب بعد إتمام التحويل</p>
      <div class="badge-phone">رقم زين كاش وآسيا حوالة المعتمد: ${PAYMENT_INFO.supportPhone}</div>
    </div>

    <div class="grid">${booksCards}</div>
  </div>

  <div id="payModal" class="modal-bg">
    <div class="modal-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3 id="modalTitle" style="font-weight:900;">طلب تفعيل المادة</h3>
        <button onclick="document.getElementById('payModal').style.display='none'" style="background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">✕</button>
      </div>

      <div style="background:#0b0f19; padding:15px; border-radius:14px; border:1px solid #334155; margin-bottom:15px; font-size:0.85rem;">
        <p style="color:#60a5fa; font-weight:bold; margin-bottom:6px;">💳 تفاصيل التحويل (المبلغ: 10,000 د.ع):</p>
        <p>زين كاش: <b style="color:#38bdf8; font-family:monospace;">${PAYMENT_INFO.zainCash}</b></p>
        <p>آسيا حوالة: <b style="color:#38bdf8; font-family:monospace;">${PAYMENT_INFO.asiaHawala}</b></p>
      </div>

      <form onsubmit="sendOrder(event)">
        <input id="stuName" class="form-inp" placeholder="اسم الطالب الثلاثي" required />
        <input id="stuPhone" class="form-inp" placeholder="رقم الهاتف (الواتساب)" required />
        <input id="stuTrans" class="form-inp" placeholder="رقم إشعار التحويل / الوصل" required />
        <button type="submit" class="btn-pay">إرسال وتأكيد الطلب 🚀</button>
        <a id="waLink" href="https://wa.me/${PAYMENT_INFO.supportPhone}" target="_blank" class="btn-wa">📲 مراسلة الدعم الفني عبر الواتساب</a>
      </form>
    </div>
  </div>

  <script>
    let curBook = '';
    function openPaymentModal(title) {
      curBook = title;
      document.getElementById('modalTitle').innerText = 'تفعيل ' + title + ' (10,000 د.ع)';
      document.getElementById('payModal').style.display = 'flex';
    }
    async function sendOrder(e) {
      e.preventDefault();
      const student_name = document.getElementById('stuName').value;
      const phone = document.getElementById('stuPhone').value;
      const transaction_ref = document.getElementById('stuTrans').value;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_name, phone, book_title: curBook, payment_method: 'زين كاش', transaction_ref })
      });
      const data = await res.json();
      alert('✅ ' + data.message);
      window.open('https://wa.me/${PAYMENT_INFO.supportPhone}?text=' + encodeURIComponent('مرحباً، حولت 10,000 د.ع لمادة (' + curBook + ') رقم الوصل: ' + transaction_ref), '_blank');
      document.getElementById('payModal').style.display = 'none';
    }
  </script>
</body>
</html>`;

  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🚀 خادم طلبتي يعمل على المنفذ ' + PORT));
