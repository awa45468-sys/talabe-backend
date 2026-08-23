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

// 4. واجهة HTML المباشرة
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

// تشغيل محلي أو التصدير لـ Vercel
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 منصة طلبتي تعمل على المنفذ ${PORT}`));
}

module.exports = app;
