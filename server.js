const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// 1. الاتصال بـ Supabase (اختياري)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// 2. تفاصيل حسابات الدفع المعتمدة
const PAYMENT_INFO = {
  zainCash: "07734378998",
  rafidainCard: "910160728184",
  rasheedCard: "6281 0000 0000 0000",
  asiaHawala: "07734378998",
  price: "10,000 دينار عراقي",
  supportPhone: "9647734378998"
};

// 3. قاعدة بيانات الملازم الـ 11
const booksData = [
  { id: 1, title: 'الملزمة الشاملة للاجتماعيات الوزارية', category: 'اجتماعيات', teacher: 'الأستاذ قصي الربيعي', pages: '190 صفحة', desc: 'تتضمن التاريخ، الجغرافيا، والوطنية مع حلول جميع التعاليل والخرائط والتعاريف الوزارية.' },
  { id: 2, title: 'مرشحات الرياضيات - الجزء الأول', category: 'رياضيات', teacher: 'الأستاذ حيدر وليد', pages: '165 صفحة', desc: 'حلول نموذجية وشرح مبسط لجميع الأسئلة والتمارين الوزارية المكررة للفصول 1 و 2 و 3.' },
  { id: 3, title: 'مرشحات الرياضيات - الجزء الثاني', category: 'رياضيات', teacher: 'الأستاذ حيدر وليد', pages: '150 صفحة', desc: 'تغطية كاملة لفصول الهندسة والإحصاء والمجسمات مع الأسئلة المتوقعة بنسبة 100%.' },
  { id: 4, title: 'ملزمة قواعد اللغة العربية الشاملة', category: 'لغة عربية', teacher: 'الأستاذ حمزة الجابري', pages: '180 صفحة', desc: 'شرح مبسط لقواعد الثالث المتوسط مع إعراب الأمثلة والتمارين والأسئلة الوزارية.' },
  { id: 5, title: 'ملزمة الأدب والنصوص والإنشاء', category: 'لغة عربية', teacher: 'الأستاذ حمزة الجابري', pages: '140 صفحة', desc: 'تحليل قصائد الشعراء المطلوبة وزارياً وطرق كتابة الإنشاء الكامل لضمان 20 درجة.' },
  { id: 6, title: 'ملزمة اللغة الإنكليزية الذهبية', category: 'إنكليزي', teacher: 'الأستاذ محمد العبيدي', pages: '175 صفحة', desc: 'شرح قواعد المنهج، القطع الاستيعابية، والإنشاءات الوزارية المترجمة والمعتمدة.' },
  { id: 7, title: 'ملزمة قوانين ومسائل الفيزياء', category: 'فيزياء', teacher: 'الأستاذ مؤيد سليم', pages: '160 صفحة', desc: 'شرح القوانين الرياضية، ربط المقاومات، والمشاريع مع المسائل الوزارية.' },
  { id: 8, title: 'ملزمة الكيمياء الوزارية الشاملة', category: 'كيمياء', teacher: 'الأستاذ مهند السوداني', pages: '155 صفحة', desc: 'الترتيب الإلكتروني، المعادلات الكيميائية، والكشوفات والتحضيرات المطلوبة.' },
  { id: 9, title: 'ملزمة الأحياء والرسومات الوزارية', category: 'أحياء', teacher: 'الأستاذ ماهر نايف', pages: '145 صفحة', desc: 'ملخص أجهزة جسم الإنسان مع كافة الرسومات والمخططات المطلوبة في الوزاري.' },
  { id: 10, title: 'ملزمة التربية الإسلامية والأحكام', category: 'إسلامية', teacher: 'الأستاذ أحمد النعيمي', pages: '120 صفحة', desc: 'شرح أحكام التلاوة، تفسير السور الكريمة، والأحاديث النبوية الشريفة.' },
  { id: 11, title: 'بنك الوزاريات الشامل (جميع المواد)', category: 'شامل', teacher: 'نخبة الأساتذة الأوائل', pages: '320 صفحة', desc: 'تجميع لكافة أسئلة الامتحانات الوزارية للسنوات السابقة مع أجوبتها النموذجية المعتمدة.' }
];

// API: جلب الملازم
app.get('/api/books', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('books').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json(booksData);
});

// API: تسجيل الطلبات
app.post('/api/orders', async (req, res) => {
  const { student_name, phone, book_title, payment_method, transaction_ref, governorate } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, error: 'يرجى إكمال كافة البيانات ورقم الحوالة/الوصل.' });
  }

  if (supabase) {
    try {
      await supabase.from('orders').insert([{
        student_name,
        phone,
        governorate: governorate || 'بغداد',
        book_title,
        payment_method,
        transaction_ref,
        price: PAYMENT_INFO.price,
        status: 'قيد التحقق'
      }]);
    } catch (e) {}
  }

  res.json({
    success: true,
    message: 'تم إرسال طلبك ورقم الحوالة بنجاح! سيتم تفعيل وتحميل الكتاب لك عبر الواتساب فور التأكد من التحويل.'
  });
});

// 4. واجهة HTML المباشرة (تعمل فوراً على Vercel و GitHub دون الحاجة لمجلد dist وبدون خطأ 404)
app.get('*', (req, res) => {
  const booksHtml = booksData.map(b => `
    <div class="card">
      <div class="badge">${b.category} • ${b.pages}</div>
      <h3>${b.title}</h3>
      <p class="teacher">👨‍🏫 ${b.teacher}</p>
      <p class="desc">${b.desc}</p>
      <div class="card-footer">
        <span class="price">10,000 د.ع</span>
        <button onclick="openModal('${b.title}')" class="btn-buy">فتح وتفعيل الملزمة 🔓</button>
      </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>منصة طلبتي التعليمية | الملازم والمرشحات الوزارية 2026</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
    body { background: #0f172a; color: #f8fafc; padding: 20px 15px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 2.2rem; font-weight: 900; color: #818cf8; margin-bottom: 8px; }
    .header p { color: #94a3b8; font-size: 0.95rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    .banner { background: linear-gradient(135deg, #1e1b4b, #312e81); border: 1px solid #4338ca; border-radius: 20px; padding: 25px; margin-bottom: 35px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    .banner h2 { font-size: 1.4rem; color: #e0e7ff; margin-bottom: 10px; }
    .banner p { color: #c7d2fe; font-size: 0.9rem; }
    .payment-badge { display: inline-block; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4); padding: 4px 12px; border-radius: 999px; font-weight: bold; font-size: 0.8rem; margin-top: 10px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: #6366f1; }
    .badge { background: #312e81; color: #a5b4fc; font-size: 0.75rem; font-weight: bold; padding: 4px 10px; border-radius: 8px; align-self: flex-start; margin-bottom: 12px; }
    .card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 6px; color: #fff; }
    .teacher { font-size: 0.85rem; color: #a5b4fc; margin-bottom: 8px; font-weight: 600; }
    .desc { font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 20px; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #334155; padding-top: 15px; }
    .price { font-size: 1.1rem; font-weight: 900; color: #10b981; }
    .btn-buy { background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 12px; font-weight: bold; font-size: 0.85rem; cursor: pointer; }
    .btn-buy:hover { background: #4338ca; }
    /* Modal */
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 100; align-items: center; justify-content: center; padding: 15px; }
    .modal { background: #1e293b; border: 1px solid #475569; width: 100%; max-width: 500px; border-radius: 24px; padding: 25px; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px; }
    .modal-header h3 { font-size: 1.1rem; font-weight: 900; color: #fff; }
    .btn-close { background: #334155; color: #fff; border: none; border-radius: 8px; width: 30px; height: 30px; cursor: pointer; font-weight: bold; }
    .pay-box { background: #0f172a; border: 1px solid #334155; border-radius: 14px; padding: 12px; margin-bottom: 15px; font-size: 0.85rem; }
    .pay-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .pay-num { font-family: monospace; font-weight: bold; color: #38bdf8; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 600; }
    .form-group input, .form-group select { width: 100%; padding: 10px 12px; border-radius: 10px; background: #0f172a; border: 1px solid #334155; color: #fff; font-size: 0.85rem; outline: none; }
    .form-group input:focus { border-color: #6366f1; }
    .btn-submit { width: 100%; background: #10b981; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 900; font-size: 0.95rem; cursor: pointer; margin-top: 10px; }
    .btn-submit:hover { background: #059669; }
    .btn-whatsapp { display: block; width: 100%; text-align: center; text-decoration: none; background: #25d366; color: #fff; padding: 10px; border-radius: 12px; font-weight: bold; font-size: 0.85rem; margin-top: 8px; }
    footer { text-align: center; color: #64748b; font-size: 0.8rem; margin-top: 50px; padding-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 منصة طلبتي التعليمية</h1>
      <p>المتجر الرسمي للملازم والمرشحات الوزارية المعتمدة للصف الثالث المتوسط 2026</p>
    </div>

    <div class="banner">
      <h2>🔥 جميع الملازم الوزارية محدثة وفق تقليصات وزارة التربية</h2>
      <p>اختر ملزمتك، وقم بالتحويل عبر زين كاش أو ماستر كارد لتفعيل فوري بـ 10,000 د.ع فقط</p>
      <span class="payment-badge">✓ تفعيل مباشر عبر الواتساب بنقرة واحدة</span>
    </div>

    <div class="grid">
      ${booksHtml}
    </div>

    <footer>
      <p>منصة طلبتي التعليمية © 2026 • معتمدة لطلاب العراق 🇮🇶</p>
    </footer>
  </div>

  <!-- Checkout Modal -->
  <div class="modal-overlay" id="checkoutModal">
    <div class="modal">
      <div class="modal-header">
        <h3 id="modalBookTitle">طلب تفعيل الملزمة</h3>
        <button class="btn-close" onclick="closeModal()">✕</button>
      </div>

      <div class="pay-box">
        <div style="font-weight:bold; color:#a5b4fc; margin-bottom:8px;">💳 حسابات الدفع المعتمدة (المبلغ: 10,000 د.ع):</div>
        <div class="pay-row">
          <span>زين كاش (Zain Cash):</span>
          <span class="pay-num">${PAYMENT_INFO.zainCash}</span>
        </div>
        <div class="pay-row">
          <span>ماستر كارد الرافدين:</span>
          <span class="pay-num">${PAYMENT_INFO.rafidainCard}</span>
        </div>
        <div class="pay-row">
          <span>ماستر كارد الرشيد:</span>
          <span class="pay-num">${PAYMENT_INFO.rasheedCard}</span>
        </div>
        <div class="pay-row">
          <span>آسيا حوالة:</span>
          <span class="pay-num">${PAYMENT_INFO.asiaHawala}</span>
        </div>
      </div>

      <form id="orderForm" onsubmit="submitOrder(event)">
        <input type="hidden" id="bookTitleInput" name="book_title">
        <div class="form-group">
          <label>اسم الطالب الثلاثي:</label>
          <input type="text" id="studentName" placeholder="مثال: علي محمد حسن" required>
        </div>
        <div class="form-group">
          <label>رقم الهاتف (الواتساب):</label>
          <input type="tel" id="studentPhone" placeholder="07700000000" required>
        </div>
        <div class="form-group">
          <label>المحافظة:</label>
          <input type="text" id="studentGov" placeholder="بغداد، البصرة، أربيل...">
        </div>
        <div class="form-group">
          <label>طريقة الدفع:</label>
          <select id="paymentMethod">
            <option value="زين كاش (Zain Cash)">زين كاش (Zain Cash)</option>
            <option value="ماستر كارد الرافدين (الكي كارد)">ماستر كارد الرافدين (الكي كارد)</option>
            <option value="ماستر كارد الرشيد">ماستر كارد الرشيد</option>
            <option value="آسيا حوالة">آسيا حوالة</option>
          </select>
        </div>
        <div class="form-group">
          <label>رقم الحوالة / العملية / الوصل:</label>
          <input type="text" id="transRef" placeholder="أدخل رقم الإشعار أو الحوالة" required>
        </div>

        <button type="submit" class="btn-submit">تأكيد الطلب والتفعيل 🚀</button>
        <a id="waDirectBtn" href="https://wa.me/${PAYMENT_INFO.supportPhone}" target="_blank" class="btn-whatsapp">📲 تواصل مع الدعم الفني عبر الواتساب</a>
      </form>
    </div>
  </div>

  <script>
    function openModal(bookTitle) {
      document.getElementById('modalBookTitle').innerText = 'تفعيل ' + bookTitle;
      document.getElementById('bookTitleInput').value = bookTitle;
      document.getElementById('checkoutModal').style.display = 'flex';
    }
    function closeModal() {
      document.getElementById('checkoutModal').style.display = 'none';
    }
    async function submitOrder(e) {
      e.preventDefault();
      const student_name = document.getElementById('studentName').value;
      const phone = document.getElementById('studentPhone').value;
      const governorate = document.getElementById('studentGov').value;
      const book_title = document.getElementById('bookTitleInput').value;
      const payment_method = document.getElementById('paymentMethod').value;
      const transaction_ref = document.getElementById('transRef').value;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_name, phone, governorate, book_title, payment_method, transaction_ref })
        });
        const data = await res.json();
        if (data.success) {
          alert('✅ تم استلام طلبك بنجاح! سيتم تحويلك للواتساب لإرسال الوصل وتفعيل الملزمة فوراً.');
          const msg = 'مرحباً، قمت بتحويل مبلغ ملزمة (' + book_title + ') عبر ' + payment_method + '، رقم الحوالة: ' + transaction_ref + ' باسم الطالب: ' + student_name;
          window.open('https://wa.me/${PAYMENT_INFO.supportPhone}?text=' + encodeURIComponent(msg), '_blank');
          closeModal();
        } else {
          alert('خطأ: ' + (data.error || 'يرجى التأكد من البيانات'));
        }
      } catch (err) {
        alert('تم تسجيل طلبك، يرجى مراسلتنا عبر الواتساب.');
      }
    }
  </script>
</body>
</html>`;
  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 منصة تفوّق تعمل على المنفذ ${PORT}`));
// ==============================================================================================
// 🎓 منصة طلبتي التعليمية - المتجر الرسمي للملازم والمرشحات الذكية 2026
// سكربت كامل شامل متكامل (Single File Full App for Node.js / Vercel / GitHub)
// يحتوي على: ملازم المرشحات الذهبية + اختصار التعاليل والإنشاءات + أسئلة الذكاء والاختبارات المبهجة
// ==============================================================================================

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 💳 إعدادات الدفع الرسمية للمنصة
const PAYMENT_CONFIG = {
  rafidainCard: "910160728184",
  asiaHawala: "07734378998",
  zainCash: "07734378998",
  supportPhone: "9647734378998",
  price: "10,000 د.ع"
};

// 📚 بيانات الملازم والمرشحات الذكية (بدون أسماء مدرسين - خاصة بمنصة طلبتي)
const BOOKS_DATABASE = [
  {
    id: "ar-grammar",
    title: "ملزمة قواعد اللغة العربية المركزة والذكية",
    subject: "لغة عربية",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "120 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "أقوى ملخص لقواعد الثالث المتوسط مع إعراب الأمثلة والتمارين الوزارية المكررة حصرياً بأسلوب مبسط.",
    badge: "الأعلى طلباً ⭐",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "ar-lit",
    title: "ملزمة الأدب والنصوص والإنشاءات المختصرة",
    subject: "لغة عربية",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "90 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "إنشاءات وزارية نموذجية مختصرة (طريقك للـ 20 درجة) مع تحليل مبسط لشعراء المنهج.",
    badge: "إنشاءات مضمونة 💯",
    color: "from-rose-500 to-red-600"
  },
  {
    id: "en-gold",
    title: "ملزمة اللغة الإنكليزية الذهبية الشاملة",
    subject: "إنكليزي",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "110 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "تضم القواعد، القطع الاستيعابية، والإنشاءات الوزارية المترجمة والمبسطة لضمان التفوق.",
    badge: "شاملة القواعد",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "math-p1",
    title: "مرشحات الرياضيات الذهبية (الجزء الأول)",
    subject: "رياضيات",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "100 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "أهم الأسئلة الوزارية المكررة للفصول الثلاثة الأولى مع حلول نموذجية قصيرة وسريعة الفهم.",
    badge: "مرشحات مؤكدة 🔥",
    color: "from-purple-500 to-indigo-700"
  },
  {
    id: "math-p2",
    title: "مرشحات الرياضيات الذهبية (الجزء الثاني)",
    subject: "رياضيات",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "95 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "تغطية كاملة لفصول الهندسة والمثلثات والمجسمات مع الأسئلة المتوقعة وزارياً.",
    badge: "الجزء الثاني",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "soc-com",
    title: "ملزمة الاجتماعيات الوزارية (تعاليل وتعاریف مختصرة)",
    subject: "اجتماعيات",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "130 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "تتضمن التاريخ، الجغرافيا، والوطنية مع اختصار خارق لجميع التعاليل والتعاريف والخرائط الوزارية.",
    badge: "تاريخ وجغرافيا",
    color: "from-emerald-500 to-teal-700"
  },
  {
    id: "chem-com",
    title: "ملزمة الكيمياء المنهجية (المعادلات والكشوفات)",
    subject: "كيمياء",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "95 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "ترتيب إلكتروني مبسط، معادلات كيميائية موزونة، وكشوفات وتحضيرات مختارة بعناية للوزاري.",
    badge: "كشوفات ومعادلات",
    color: "from-teal-500 to-emerald-600"
  },
  {
    id: "phys-law",
    title: "ملزمة قوانين ومسائل الفيزياء المضمونة",
    subject: "فيزياء",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "100 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "قوانين الفيزياء مبسطة في جداول مع حل المسائل الوزارية المتكررة بطرق سهلة جداً.",
    badge: "مسائل وقوانين",
    color: "from-sky-500 to-indigo-600"
  },
  {
    id: "bio-diag",
    title: "ملزمة الأحياء والرسومات الوزارية المركزة",
    subject: "أحياء",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "90 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "أجهزة جسم الإنسان مشروحة بنقاط واضحة جداً مع أهم الرسومات الوزارية المكررة (كالسن، الخلية العصبية).",
    badge: "رسومات مبسطة",
    color: "from-green-500 to-emerald-700"
  },
  {
    id: "islamic-rules",
    title: "ملزمة التربية الإسلامية والأحكام الوزارية",
    subject: "إسلامية",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "80 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "أحكام التلاوة، المعاني، والحديث الشريف مشروحة بأسلوب شيق يضمن الدرجة الكاملة.",
    badge: "درجة كاملة 🌟",
    color: "from-amber-600 to-yellow-600"
  },
  {
    id: "all-in-one",
    title: "بنك وزاريات طلبتي الشامل (جميع المواد VIP)",
    subject: "شامل",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "200 صفحة (مختصرة)",
    price: "10,000 د.ع",
    desc: "المراجعة النهائية الخارقة لجميع المواد، تشمل عصارة السنوات السابقة لتضمن نجاحك وتفوقك.",
    badge: "VIP شامل 👑",
    color: "from-indigo-600 via-purple-600 to-pink-600"
  }
];

// ✍️ أسئلة الاختبارات والذكاء المبهجة لطلبة طلبتي
const QUIZ_QUESTIONS = [
  {
    subject: "لغة عربية",
    q: "ما هو إعراب (ما) في جملة: (ما نجحَ الكسولُ)؟",
    options: ["نافية غير عاملة لا محل لها من الإعراب", "اسم استفهام في محل رفع مبتدأ", "اسم موصول بمعنى الذي", "حرف جر زائد"],
    correct: 0,
    exp: "رائع جداً! (ما) هنا نافية دخلت على الفعل الماضي فتكون نافية غير عاملة."
  },
  {
    subject: "رياضيات",
    q: "ما هو ناتج تحليل المقدار: (x² - 9) بالفرق بين مربعين؟",
    options: ["(x - 3)(x + 3)", "(x - 9)(x + 1)", "(x - 3)²", "(x + 3)²"],
    correct: 0,
    exp: "عاشق للرياضيات! الفرق بين مربعين: (جذر الأول - جذر الثاني)(جذر الأول + جذر الثاني)."
  },
  {
    subject: "أحياء",
    q: "ما هي الأربطة في جسم الإنسان حسب مرشحات طلبتي؟",
    options: ["أشرطة مرنة ليفية تربط العظام مع بعضها", "حبال ليفية تربط العظام بالعضلات", "أجزاء مرنة قابلة للحركة البسيطة", "مناطق ارتباط عظمين مع بعضهما"],
    correct: 0,
    exp: "ممتاز! الأربطة تربط العظام مع بعضها لحماية المفاصل، بينما الأوتار تربط العظام بالعضلات."
  },
  {
    subject: "فيزياء",
    q: "يقاس التيار الكهربائي في الدائرة الكهربائية بواسطة جهاز:",
    options: ["الأميتر (Ammeter)", "الفولتميتر (Voltmeter)", "الأوميتر (Ohmmeter)", "الباروميتر"],
    correct: 0,
    exp: "بطل! يربط جهاز الأميتر على التوالي في الدائرة الكهربائية لقياس التيار."
  }
];

// عرض الواجهة الكاملة للمنصة
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>🎓 منصة طلبتي التعليمية | المتجر الرسمي للملازم والمرشحات الذكية 2026</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <style>
    body { font-family: 'Tajawal', 'Cairo', sans-serif; }
    .glass-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .badge-glow { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen selection:bg-amber-500 selection:text-slate-950 pb-20">

  <header class="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
          🎓
        </div>
        <div>
          <h1 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
            منصة طلبتي الذكية
            <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">2026</span>
          </h1>
          <p class="text-[11px] text-emerald-400 font-bold">✨ ملازم مختصرة ومضمونة لنجاحك وتفوقك</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="openQuizModal()" class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5 cursor-pointer">
          <span>✍️ اختبر نفسك</span>
        </button>
        <button onclick="openWhatsAppDirect()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-600/30">
          <span>💬 دعم طلبتي</span>
        </button>
      </div>
    </div>
  </header>

  <div class="bg-gradient-to-r from-amber-600/20 via-indigo-600/20 to-emerald-600/20 border-b border-indigo-500/20 py-2.5 px-4 text-center">
    <div class="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
      <span class="text-amber-400 flex items-center gap-1">🎉 بشرى لطلاب الثالث المتوسط:</span>
      <span class="text-white font-medium">ملازمنا مصممة خصيصاً لتختصر وقتك وتضمن لك معدل عالي بكل سعادة وراحة!</span>
    </div>
  </div>

  <main class="max-w-6xl mx-auto px-4 py-6 space-y-8">
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="space-y-3 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>تفعيل فوري عبر سوبر كي / ماستر كارد / آسيا حوالة</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white leading-tight">
          ادرس بذكاء وليس بجهد! <span class="text-amber-400">مرشحات طلبتي المركزة</span> لطريق الـ 100 🏆
        </h2>
        <p class="text-xs sm:text-sm text-slate-300">
          اختر أي ملزمة بـ <strong>10,000 د.ع فقط</strong>، وحول المبلغ عبر سوبر كي أو آسيا حوالة واستلم كود التفعيل الخاص بك لتفتح المادة فوراً وتعيش تجربة دراسة ممتعة!
        </p>
      </div>

      <div class="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
        <button onclick="scrollToBooks()" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
          <span>📚 تصفح ملازم طلبتي (11 ملزمة)</span>
        </button>
        <button onclick="openDirectCodeModal()" class="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer">
          <span>🔑 لدي كود تفعيل جاهز</span>
        </button>
      </div>
    </div>

    <!-- شبكة الملازم الـ 11 -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>📚 ملازم ومرشحات طلبتي الحصرية (مختصرة ومضمونة)</span>
          </h3>
          <p class="text-xs text-slate-400">جميع الملازم معدة بعناية فائقة لتسهيل الحفظ والتركيز السريع</p>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="books-grid"></div>
    </div>
  </main>

  <!-- Modal الدفع والتفعيل -->
  <div id="payment-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
    <div class="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95">
      <!-- Modal Header -->
      <div class="p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            💳
          </div>
          <div>
            <h3 class="text-base font-black" id="modal-book-title">تفعيل الملزمة</h3>
            <p class="text-xs text-amber-400 font-bold">المبلغ المطلوب: 10,000 د.ع فقط</p>
          </div>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer">✕</button>
      </div>

      <!-- تبويبات الدفع -->
      <div class="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
        <button id="tab-btn-transfer" onclick="switchTab('transfer')" class="flex-1 py-2.5 px-3 rounded-xl text-xs font-black bg-indigo-600 text-white transition cursor-pointer">
          1. التحويل وسوبر كي 💳
        </button>
        <button id="tab-btn-code" onclick="switchTab('code')" class="flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-800 transition cursor-pointer">
          2. لدي كود تفعيل 🔑
        </button>
      </div>

      <div class="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- القسم 1: بيانات التحويل وسوبر كي -->
        <div id="transfer-tab-content" class="space-y-4">
          <div class="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-slate-300">بيانات التحويل المعتمدة (حول 10,000 د.ع):</span>
              <span class="text-[11px] text-emerald-400 font-bold">تفعيل فوري ✅</span>
            </div>
            <!-- سوبر كي و ماستر كارد الرافدين -->
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span class="text-[11px] text-slate-400 block">سوبر كي / ماستر كارد الرافدين:</span>
                <span class="text-sm font-black font-mono text-amber-300">910160728184</span>
              </div>
              <button onclick="copyText('910160728184', 'ماستر كارد الرافدين')" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer">
                نسخ الرقم 📋
              </button>
            </div>
            <!-- آسيا حوالة -->
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span class="text-[11px] text-slate-400 block">آسيا حوالة (رقم المحفظة):</span>
                <span class="text-sm font-black font-mono text-rose-300">07734378998</span>
              </div>
              <button onclick="copyText('07734378998', 'آسيا حوالة')" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer">
                نسخ الرقم 📋
              </button>
            </div>
            <!-- زين كاش -->
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span class="text-[11px] text-slate-400 block">زين كاش (رقم المحفظة):</span>
                <span class="text-sm font-black font-mono text-pink-300">07734378998</span>
              </div>
              <button onclick="copyText('07734378998', 'زين كاش')" class="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold cursor-pointer">
                نسخ الرقم 📋
              </button>
            </div>
          </div>

          <!-- استمارة تأكيد التحويل وإرسال الوصل للواتساب -->
          <form onsubmit="handleOrderSubmit(event)" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">اسم الطالب الثلاثي:</label>
              <input type="text" id="order-student-name" required placeholder="مثال: أحمد سامي حسن" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف / الواتساب:</label>
              <input type="tel" id="order-phone" required placeholder="07700000000" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">طريقة التحويل:</label>
              <select id="order-method" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none">
                <option>سوبر كي / ماستر كارد الرافدين</option>
                <option>آسيا حوالة</option>
                <option>زين كاش</option>
                <option>ماستر كارد الرشيد</option>
              </select>
            </div>
            <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition">
              <span>إرسال إشعار التحويل لخدمة طلبتي 🚀</span>
            </button>
          </form>
        </div>

        <!-- القسم 2: إدخال كود التفعيل المباشر -->
        <div id="code-tab-content" class="space-y-4 hidden text-center py-2">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl border border-amber-500/30">
            🔑
          </div>
          <div>
            <h4 class="text-sm font-black text-white">إدخال كود التفعيل المباشر</h4>
            <p class="text-xs text-slate-400 mt-1">أدخل الكود الذي استلمته من الدعم لفتح المادة فوراً</p>
          </div>
          <form onsubmit="handleCodeSubmit(event)" class="space-y-3 max-w-sm mx-auto">
            <input type="text" id="activation-code-input" required placeholder="مثال: TALABATI2026" class="w-full p-3.5 rounded-xl bg-slate-800 border-2 border-indigo-500/50 text-center font-mono font-black text-base tracking-widest text-indigo-300 uppercase focus:outline-none">
            <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg cursor-pointer transition">
              <span>تأكيد الكود وفتح الملزمة فوراً 🔓</span>
            </button>
          </form>
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-right">
            <strong class="text-amber-400 block mb-1">💡 أكواد التفعيل المعتمدة:</strong>
            • <code class="text-indigo-400 font-bold">TALABATI2026</code> : فتح الملزمة المختارة.<br>
            • <code class="text-indigo-400 font-bold">VIP100</code> : كود شامل لفتح كافة ملازم طلبتي الـ 11.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal الاختبار الوزاري المبهج -->
  <div id="quiz-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
    <div class="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">🌟</span>
          <h3 class="text-sm font-black text-white">اختبار طلبتي الذكي والسريع</h3>
        </div>
        <button onclick="closeQuizModal()" class="p-1 text-slate-400 hover:text-white cursor-pointer">✕</button>
      </div>
      <div id="quiz-content" class="space-y-4"></div>
    </div>
  </div>

  <footer class="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-900">
    <p>منصة طلبتي التعليمية الذكية © 2026 • صنعت خصيصاً لطلاب العراق الأبطال 🇮🇶</p>
  </footer>

  <script>
    const BOOKS_DATA = ${JSON.stringify(BOOKS_DATABASE)};
    const QUESTIONS = ${JSON.stringify(QUIZ_QUESTIONS)};
    let selectedBook = null;
    let unlockedBooks = JSON.parse(localStorage.getItem('unlocked_books') || '[]');

    function renderBooks() {
      const grid = document.getElementById('books-grid');
      grid.innerHTML = BOOKS_DATA.map(book => {
        const isUnlocked = unlockedBooks.includes(book.id) || unlockedBooks.includes('ALL');
        return \`
          <div class="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all hover:scale-[1.01] shadow-xl">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                  \${book.subject} • \${book.pages}
                </span>
                <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                  \${book.badge}
                </span>
              </div>
              <h4 class="text-base font-black text-white leading-snug">\${book.title}</h4>
              <p class="text-xs text-amber-400 font-bold">\${book.author}</p>
              <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">\${book.desc}</p>
            </div>

            <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span class="text-sm font-black font-mono text-emerald-400">\${book.price}</span>
              \${isUnlocked ? \`
                <button onclick="readBook('\${book.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5">
                  <span>دراسة الملزمة 📖</span>
                </button>
              \` : \`
                <button onclick="openPaymentModal('\${book.id}')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5">
                  <span>فتح وتفعيل 🔓</span>
                </button>
              \`}
            </div>
          </div>
        \`;
      }).join('');
    }

    function scrollToBooks() {
      document.getElementById('books-grid').scrollIntoView({ behavior: 'smooth' });
    }

    function openPaymentModal(bookId) {
      selectedBook = BOOKS_DATA.find(b => b.id === bookId) || BOOKS_DATA[0];
      document.getElementById('modal-book-title').innerText = selectedBook.title;
      document.getElementById('payment-modal').classList.remove('hidden');
    }

    function openDirectCodeModal() {
      openPaymentModal('ar-grammar');
      switchTab('code');
    }

    function closeModal() {
      document.getElementById('payment-modal').classList.add('hidden');
    }

    function switchTab(tab) {
      const isTransfer = tab === 'transfer';
      document.getElementById('transfer-tab-content').classList.toggle('hidden', !isTransfer);
      document.getElementById('code-tab-content').classList.toggle('hidden', isTransfer);

      document.getElementById('tab-btn-transfer').className = isTransfer
        ? "flex-1 py-2.5 px-3 rounded-xl text-xs font-black bg-indigo-600 text-white transition cursor-pointer"
        : "flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-800 transition cursor-pointer";

      document.getElementById('tab-btn-code').className = !isTransfer
        ? "flex-1 py-2.5 px-3 rounded-xl text-xs font-black bg-emerald-600 text-white transition cursor-pointer"
        : "flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-800 transition cursor-pointer";
    }

    function copyText(txt, label) {
      navigator.clipboard.writeText(txt);
      alert('تم نسخ رقم ' + label + ' بنجاح ✅: ' + txt);
    }

    function openWhatsAppDirect() {
      const msg = 'مرحباً منصة طلبتي 🌟، أرغب بالاستفسار عن ملازم ومرشحات الثالث المتوسط 2026.';
      window.open('https://wa.me/9647734378998?text=' + encodeURIComponent(msg), '_blank');
    }

    function handleOrderSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('order-student-name').value;
      const phone = document.getElementById('order-phone').value;
      const method = document.getElementById('order-method').value;

      const waMsg = 'مرحباً إدارة طلبتي 🌸\\nلقد قمت بتحويل مبلغ 10,000 د.ع لتفعيل ملزمة:\\n📚 *' + selectedBook.title + '*\\n\\n👤 اسم البطل/الطالب: ' + name + '\\n📱 رقم الهاتف: ' + phone + '\\n💳 طريقة التحويل: ' + method + '\\n\\nيرجى تزويدي بكود التفعيل السريع وفرح قلبي!';

      alert('تم إرسال تفاصيل طلبك بنجاح! يتم الآن تحويلك للواتساب لاستلام الكود فوراً.');
      window.open('https://wa.me/9647734378998?text=' + encodeURIComponent(waMsg), '_blank');
      closeModal();
    }

    function handleCodeSubmit(e) {
      e.preventDefault();
      const code = document.getElementById('activation-code-input').value.trim().toUpperCase();
      const valid = ['TALABATI2026', 'VIP100', 'TALABATI', 'SUCCESS2026'];

      if (valid.includes(code)) {
        if (code === 'VIP100' || code === 'SUCCESS2026') {
          unlockedBooks = ['ALL'];
          localStorage.setItem('unlocked_books', JSON.stringify(['ALL']));
        } else {
          if (!unlockedBooks.includes(selectedBook.id)) {
            unlockedBooks.push(selectedBook.id);
            localStorage.setItem('unlocked_books', JSON.stringify(unlockedBooks));
          }
        }

        try { confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); } catch(err) {}
        alert('🎉 مبروك يا بطل! تم تفعيل الملزمة بنجاح تام. استمتع بالدراسة وتحقيق الـ 100 🌟');
        closeModal();
        renderBooks();
      } else {
        alert('❌ كود التفعيل غير صحيح! تواصل معنا عبر واتساب الدعم للحصول على كودك الخاص.');
      }
    }

    function readBook(bookId) {
      try { confetti({ particleCount: 60, spread: 50 }); } catch(e){}
      alert('📖 أهلاً بك في بيئة القراءة الذكية لملزمة طلبتي! الملزمة جاهزة ومبسطة لتضمن تفوقك بمرتبة الشرف 🏆');
    }

    let currentQIdx = 0;
    function openQuizModal() {
      currentQIdx = Math.floor(Math.random() * QUESTIONS.length);
      renderQuizQuestion();
      document.getElementById('quiz-modal').classList.remove('hidden');
    }

    function closeQuizModal() {
      document.getElementById('quiz-modal').classList.add('hidden');
    }

    function renderQuizQuestion() {
      const q = QUESTIONS[currentQIdx];
      const container = document.getElementById('quiz-content');
      container.innerHTML = \`
        <div class="space-y-3">
          <span class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            مادة: \${q.subject}
          </span>
          <p class="text-sm font-bold text-white leading-relaxed">\${q.q}</p>
          <div class="space-y-2 pt-2">
            \${q.options.map((opt, idx) => \`
              <button onclick="checkQuizAnswer(\${idx})" class="w-full text-right p-3 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500 text-xs font-medium text-slate-200 transition cursor-pointer">
                \${opt}
              </button>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function checkQuizAnswer(selectedIdx) {
      const q = QUESTIONS[currentQIdx];
      if (selectedIdx === q.correct) {
        try { confetti({ particleCount: 100, spread: 70 }); } catch(e){}
        alert('🌟 إجابة صحيحة 100% وبكل إبداع!\\n' + q.exp);
      } else {
        alert('💡 لا تقلق، خطأ بسيط للتعلم! الإجابة الصحيحة هي: ' + q.options[q.correct] + '\\n' + q.exp);
      }
      closeQuizModal();
    }

    renderBooks();
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
