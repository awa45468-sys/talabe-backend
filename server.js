const express = require('express');

const app = express();
app.use(express.json());

// بيانات الحسابات وطرق الدفع
const PAYMENT_INFO = {
  zainCash: "07700000000",
  rafidainCard: "6280 0000 0000 0000",
  rasheedCard: "6281 0000 0000 0000",
  price: "10,000 دينار عراقي"
};

// قائمة الكتب والملازم
const booksData = [
  { id: 1, title: 'الملزمة الشاملة للاجتماعيات الوزارية', category: 'اجتماعيات', desc: 'تتضمن التاريخ، الجغرافيا، والوطنية مع حلول جميع التعاليل والخرائط والتعاريف.' },
  { id: 2, title: 'مرشحات الرياضيات - الجزء الأول', category: 'رياضيات', desc: 'حلول نموذجية وشرح مبسط لجميع الأسئلة والتمارين الوزارية المكررة.' },
  { id: 3, title: 'مرشحات الرياضيات - الجزء الثاني', category: 'رياضيات', desc: 'تغطية كاملة لفصول الهندسة والإحصاء والمجسمات مع الأسئلة المتوقعة.' },
  { id: 4, title: 'ملزمة قواعد اللغة العربية الشاملة', category: 'لغة عربية', desc: 'شرح مبسط لقواعد الثالث المتوسط مع إعراب الأمثلة والتمارين الوزارية.' },
  { id: 5, title: 'ملزمة الأدب والنصوص والإنشاء', category: 'لغة عربية', desc: 'تحليل قصائد الشعراء المطلوبة وزارياً وطرق كتابة الإنشاء الكامل.' },
  { id: 6, title: 'ملزمة اللغة الإنكليزية الذهبية', category: 'إنكليزي', desc: 'شرح قواعد المنهج، القطع الاستيعابية، والإنشاءات الوزارية المترجمة.' },
  { id: 7, title: 'ملزمة قوانين ومسائل الفيزياء', category: 'فيزياء', desc: 'شرح القوانين الرياضية، ربط المقاومات، والمشاريع مع المسائل الوزارية.' },
  { id: 8, title: 'ملزمة الكيمياء الوزارية الشاملة', category: 'كيمياء', desc: 'الترتيب الإلكتروني، المعادلات الكيميائية، والتحضيرات المطلوبة.' },
  { id: 9, title: 'ملزمة الأحياء والرسومات الوزارية', category: 'أحياء', desc: 'ملخص أجهزة الجسم مع كافة الرسومات والمخططات المطلوبة في الوزاري.' },
  { id: 10, title: 'ملزمة التربية الإسلامية والأحكام', category: 'إسلامية', desc: 'شرح أحكام التلاوة، تفسير السور الكريمة، والأحاديث الشريفة.' },
  { id: 11, title: 'بنك الوزاريات الشامل (جميع المواد)', category: 'شامل', desc: 'تجميع لكافة أسئلة الامتحانات الوزارية للسنوات السابقة مع أجوبتها النموذجية.' }
];

const memoryOrders = [];

// API الكتب
app.get('/api/books', (req, res) => {
  res.json(booksData);
});

// API الطلبات
app.post('/api/orders', (req, res) => {
  const { student_name, phone, book_title, payment_method, transaction_ref } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, error: 'يرجى إكمال كافة البيانات ورقم الحوالة/الوصل.' });
  }

  memoryOrders.push({
    student_name,
    phone,
    book_title,
    payment_method,
    transaction_ref,
    date: new Date()
  });

  res.json({
    success: true,
    message: 'تم إرسال طلبك ورقم الحوالة بنجاح! سيتم تفعيل وتحميل الكتاب لك عبر الواتساب فور التأكد من التحويل.'
  });
});

// الواجهة الرئيسية
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>منصة تفوّق التعليمية | الملازم والكتب الوزارية</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <style>
    :root {
      --primary-color: #4f46e5;
      --primary-dark: #3730a3;
      --bg-color: #f8fafc;
    }
    body { background-color: var(--bg-color); font-family: system-ui, -apple-system, sans-serif; }
    .hero-banner {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      color: white; padding: 50px 20px 40px; border-radius: 0 0 30px 30px;
      box-shadow: 0 10px 30px rgba(49, 46, 129, 0.2);
    }
    .card-book {
      border: none; border-radius: 20px; background: #ffffff;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04); transition: all 0.3s ease;
    }
    .card-book:hover { transform: translateY(-5px); box-shadow: 0 12px 28px rgba(79, 70, 229, 0.15); }
    .price-tag { background: #fef3c7; color: #b45309; font-weight: 700; padding: 6px 14px; border-radius: 12px; font-size: 0.85rem; }
    .category-tag { background: #e0e7ff; color: #3730a3; font-weight: 600; padding: 6px 12px; border-radius: 12px; font-size: 0.8rem; }
    .btn-pay { background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white; border: none; border-radius: 12px; padding: 12px; font-weight: 700; }
    .btn-pay:hover { color: white; opacity: 0.95; }
    .pay-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 15px; }
    .modal-content { border-radius: 24px; border: none; overflow: hidden; }
    .modal-header { background: #1e1b4b; color: white; border: none; }
  </style>
</head>
<body>

  <header class="hero-banner text-center mb-5">
    <div class="container">
      <div class="d-inline-flex align-items-center justify-content-center bg-white text-dark rounded-circle mb-3 shadow" style="width: 60px; height: 60px;">
        <i class="bi bi-book-half fs-2 text-primary"></i>
      </div>
      <h1 class="fw-bold mb-2">منصة تفوّق التعليمية</h1>
      <p class="lead text-light mb-0 fs-6">المتجر الرسمي للملازم والمرشحات الوزارية — فتح أي كتاب بـ 10,000 دينار فقط</p>
    </div>
  </header>

  <main class="container mb-5">
    <div id="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
      <p class="mt-3 text-muted fw-semibold">جاري تحميل الكتب والملازم السريعة...</p>
    </div>

    <div id="books-list" class="row g-4"></div>
  </main>

  <div class="modal fade" id="payModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow-lg">
        <div class="modal-header p-4">
          <div>
            <h5 class="modal-title fw-bold"><i class="bi bi-shield-lock-fill text-warning me-2"></i>فتح وقفل الكتاب</h5>
            <small class="text-light-50">تكلفة فتح الكتاب: <strong>10,000 دينار عراقي</strong></small>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        
        <div class="modal-body p-4">
          <form id="paymentForm">
            <input type="hidden" id="selectedBook">

            <div class="mb-3">
              <label class="form-label fw-bold">اختر طريقة الدفع المناسبة لك:</label>
              <select id="paymentMethod" class="form-select form-select-lg fs-6" onchange="updatePaymentDetails()">
                <option value="زين كاش">📲 زين كاش (Zain Cash)</option>
                <option value="ماستر كارد الرافدين">💳 ماستر كارد مصرف الرافدين (الكي كارد)</option>
                <option value="ماستر كارد الرشيد">💳 ماستر كارد مصرف الرشيد</option>
              </select>
            </div>

            <div class="pay-box mb-4 text-center">
              <span class="text-muted d-block small mb-1" id="payLabel">حول المبلغ (10,000 د.ع) لزين كاش على الرقم:</span>
              <h4 class="fw-bold text-primary mb-1" id="payAccount">${PAYMENT_INFO.zainCash}</h4>
              <small class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i>المبلغ المطلوب: 10,000 د.ع فقط</small>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">اسم الطالب الكامل</label>
              <input type="text" id="studentName" class="form-control form-control-lg fs-6" required placeholder="أحمد علي حسين">
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">رقم الواتساب للتفعيل</label>
              <input type="tel" id="phone" class="form-control form-control-lg fs-6" required placeholder="07700000000">
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold">رقم العملية / الحوالة / رقم الوصل</label>
              <input type="text" id="transactionRef" class="form-control form-control-lg fs-6" required placeholder="أدخل رقم الإشعار أو آخر 4 أرقام">
            </div>

            <button type="submit" id="submitBtn" class="btn btn-pay w-100 fs-6 shadow">
              <i class="bi bi-unlock-fill me-1"></i> تأكيد الدفع وفتح الكتاب
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    const payModal = new bootstrap.Modal(document.getElementById('payModal'));
    const paymentInfo = ${JSON.stringify(PAYMENT_INFO)};

    async function fetchBooks() {
      try {
        const res = await fetch('/api/books');
        const books = await res.json();
        const container = document.getElementById('books-list');
        document.getElementById('loading').style.display = 'none';

        container.innerHTML = books.map(book => \`
          <div class="col-md-6 col-lg-4">
            <div class="card card-book h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="price-tag"><i class="bi bi-tag-fill me-1"></i>10,000 د.ع</span>
                  <span class="category-tag">\${book.category}</span>
                </div>
                <h5 class="fw-bold text-dark mb-2">\${book.title}</h5>
                <p class="text-secondary fs-6 lh-base mb-4">\${book.desc}</p>
              </div>
              <button onclick="openPayModal('\${book.title}')" class="btn btn-pay w-100">
                <i class="bi bi-lock-fill me-1"></i> دفع 10,000 د.ع لفتح الكتاب
              </button>
            </div>
          </div>
        \`).join('');
      } catch (e) {
        document.getElementById('loading').innerHTML = '<p class="text-danger text-center">حدث خطأ في تحميل البيانات.</p>';
      }
    }

    function openPayModal(title) {
      document.getElementById('selectedBook').value = title;
      payModal.show();
    }

    function updatePaymentDetails() {
      const method = document.getElementById('paymentMethod').value;
      const accountEl = document.getElementById('payAccount');
      const labelEl = document.getElementById('payLabel');

      if (method === 'زين كاش') {
        labelEl.innerText = 'حول المبلغ (10,000 د.ع) لزين كاش على الرقم:';
        accountEl.innerText = paymentInfo.zainCash;
      } else if (method === 'ماستر كارد الرافدين') {
        labelEl.innerText = 'حول المبلغ لحساب ماستر كارد الرافدين:';
        accountEl.innerText = paymentInfo.rafidainCard;
      } else if (method === 'ماستر كارد الرشيد') {
        labelEl.innerText = 'حول المبلغ لحساب ماستر كارد الرشيد:';
        accountEl.innerText = paymentInfo.rasheedCard;
      }
    }

    document.getElementById('paymentForm').onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerText = 'جاري التأكيد...';

      const payload = {
        book_title: document.getElementById('selectedBook').value,
        payment_method: document.getElementById('paymentMethod').value,
        student_name: document.getElementById('studentName').value,
        phone: document.getElementById('phone').value,
        transaction_ref: document.getElementById('transactionRef').value
      };

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
          alert('🎉 ' + data.message);
          payModal.hide();
          document.getElementById('paymentForm').reset();
        } else {
          alert('حدث خطأ: ' + data.error);
        }
      } catch (err) {
        alert('تعذر الاتصال بالسيرفر.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-unlock-fill me-1"></i> تأكيد الدفع وفتح الكتاب';
      }
    };

    fetchBooks();
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
