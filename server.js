const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 💳 بيانات الدفع المعتمدة (10,000 د.ع)
// ==========================================
const PAYMENT_INFO = {
  zainCash: "07734378998",
  asiaHawala: "07734378998",
  rafidainCard: "910160728184",
  rasheedCard: "6281 0000 0000 0000",
  price: "10,000 د.ع",
  supportPhone: "07734378998",
  supportTelegram: "@TalabatiEdu_IQ"
};

// ==========================================
// 📚 قاعدة بيانات المناهج والملازم المعتمدة 2026
// ==========================================
const booksData = [
  { id: 1, title: "الرياضيات - الثالث متوسط", category: "الرياضيات", price: "10,000 د.ع", pages: "240 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.9, desc: "المنهج الكامل مع حلول التمارين والأسئلة الوزارية المكررة 2026." },
  { id: 2, title: "اللغة العربية - الثالث متوسط", category: "اللغة العربية", price: "10,000 د.ع", pages: "210 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.8, desc: "شامل القواعد، الأدب والنصوص والإنشاء مع نماذج وزارية معتمدة." },
  { id: 3, title: "اللغة الإنجليزية - English for Iraq", category: "اللغة الإنجليزية", price: "10,000 د.ع", pages: "190 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.9, desc: "القواعد والقطع الاستيعابية والإنشاءات والتمارين الوزارية المترجمة." },
  { id: 4, title: "الكيمياء - الثالث متوسط", category: "الكيمياء", price: "10,000 د.ع", pages: "170 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.8, desc: "المعادلات، المسائل الحسابية، والكشوفات الوزارية المضمونة 100%." },
  { id: 5, title: "الفيزياء - الثالث متوسط", category: "الفيزياء", price: "10,000 د.ع", pages: "185 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.9, desc: "شرح القوانين الرياضية، ربط المقاومات، والمسائل المكررة وزارياً." },
  { id: 6, title: "الأحياء - الثالث متوسط", category: "الأحياء", price: "10,000 د.ع", pages: "195 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.9, desc: "ملخص أجهزة جسم الإنسان مع كافة الرسومات والمخططات المطلوبة وزارياً." },
  { id: 7, title: "الاجتماعيات - الثالث متوسط", category: "الاجتماعيات", price: "10,000 د.ع", pages: "220 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.8, desc: "التاريخ، الجغرافيا، والتربية الوطنية مع حلول الخرائط والتعاليل." },
  { id: 8, title: "التربية الإسلامية - الثالث متوسط", category: "التربية الإسلامية", price: "10,000 د.ع", pages: "140 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.9, desc: "أحكام التلاوة، تفسير السور، والأحاديث النبوية الشريفة المعتمدة." },
  { id: 9, title: "العلوم - الثالث متوسط", category: "العلوم", price: "10,000 د.ع", pages: "200 صفحة", badge: "النسخة المعتمدة ⭐", rating: 4.9, desc: "شامل ومكثف لجميع الوحدات التعليمية مع حلول أسئلة الفصول." }
];

let activationCodes = [
  { code: "TAL-VIP-2026", bookId: "all", bookTitle: "جميع المواد والمناهج المعتمدة", isUsed: false, student: "طالب VIP" },
  { code: "TAL-MATH-98", bookId: 1, bookTitle: "الرياضيات - الثالث متوسط", isUsed: false, student: "علي حسن" },
  { code: "TAL-ARAB-77", bookId: 2, bookTitle: "اللغة العربية - الثالث متوسط", isUsed: false, student: "زينب أحمد" }
];

let orders = [];

// ==========================================
// 🔍 ملفات أرشفة محركات بحث جوجل (Sitemap & Robots)
// ==========================================
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send("User-agent: *\nAllow: /\nSitemap: https://talabe-backend.vercel.app/sitemap.xml");
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const urls = booksData.map(b => `
    <url>
      <loc>https://talabe-backend.vercel.app/?book=${b.id}</loc>
      <lastmod>2026-08-24</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
  `).join('');

  res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://talabe-backend.vercel.app/</loc>
      <lastmod>2026-08-24</lastmod>
      <changefreq>always</changefreq>
      <priority>1.0</priority>
    </url>
    ${urls}
  </urlset>`);
});

// ==========================================
// 🔌 مسارات API
// ==========================================
app.get('/api/books', (req, res) => res.json(booksData));
app.get('/api/payment-info', (req, res) => res.json(PAYMENT_INFO));

app.post('/api/redeem-code', (req, res) => {
  const { code, student_name } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "يرجى كتابة كود التفعيل" });

  const clean = code.trim().toUpperCase();
  const found = activationCodes.find(c => c.code.toUpperCase() === clean);

  if (!found) {
    return res.status(404).json({ success: false, message: "كود التفعيل غير صالح! تواصل مع الدعم الفني على 07734378998" });
  }

  if (found.isUsed) {
    return res.status(400).json({ success: false, message: "تم استخدام هذا الكود سابقاً" });
  }

  found.isUsed = true;
  found.usedBy = student_name || "طالب";

  res.json({
    success: true,
    message: `🎉 تم تفعيل وفتح "${found.bookTitle}" بنجاح!`,
    bookId: found.bookId
  });
});

app.post('/api/orders', (req, res) => {
  const { student_name, phone, book_title, payment_method, transaction_ref, governorate } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, message: "يرجى إكمال بيانات التحويل ورقم الوصل" });
  }

  const newOrder = {
    id: "ORD-" + Date.now(),
    student_name,
    phone,
    governorate: governorate || "العراق",
    book_title,
    payment_method,
    transaction_ref,
    price: "10,000 د.ع",
    status: "قيد التحقق",
    created_at: new Date().toLocaleString('ar-IQ')
  };

  orders.push(newOrder);

  res.json({
    success: true,
    message: "تم إرسال طلبك بنجاح! سيتم تزويدك بكود التفعيل فور تأكيد الحوالة عبر الواتساب."
  });
});

// ==========================================
// 🌐 الصفحة الرئيسية مع أقوى SEO و Rich Snippets
// ==========================================
app.get('*', (req, res) => {
  const booksCards = booksData.map(b => `
    <div class="book-card">
      <div class="card-head">
        <span class="category-badge">${b.category}</span>
        <span class="rating-badge">★ ${b.rating}</span>
      </div>
      <h3 class="book-title">${b.title}</h3>
      <p class="book-desc">${b.desc}</p>
      <div class="book-footer">
        <div>
          <span class="price-label">سعر التفعيل:</span>
          <span class="price-tag">10,000 د.ع</span>
        </div>
        <button onclick="openPaymentModal('${b.title}')" class="btn-lock">فتح المادة 🔒</button>
      </div>
    </div>
  `).join('');

  // Structured Data (Schema.org) for Google Search Rich Cards
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "منصة طلبتي التعليمية",
    "url": "https://talabe-backend.vercel.app",
    "logo": "https://talabe-backend.vercel.app/logo.png",
    "description": "المنصة العراقية الأولى لتحميل ملازم ومناهج الثالث متوسط 2026 والأسئلة الوزارية المعتمدة.",
    "telephone": "+9647734378998",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IQ",
      "addressLocality": "Baghdad"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "18400"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "IQD",
      "lowPrice": "10000",
      "highPrice": "10000",
      "offerCount": "9"
    }
  };

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>منصة طلبتي التعليمية | ملازم ومناهج الثالث متوسط 2026 المعتمدة</title>
  
  <!-- SEO & Google Search Meta Tags -->
  <meta name="description" content="منصة طلبتي التعليمية: تحميل ملازم الثالث متوسط 2026 المعتمدة وزارياً، حلول الأسئلة الوزارية، والمرشحات المضمونة لجميع محافظات العراق. تفعيل فوري بـ 10,000 د.ع.">
  <meta name="keywords" content="منصة طلبتي, ملازم الثالث متوسط 2026, ادواتي برو, كتب الثالث متوسط, مرشحات وزاري 2026, رياضيات ثالث متوسط, ملزمة العربي, زين كاش ملازم, ملازم العراق">
  <meta name="author" content="منصة طلبتي التعليمية">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://talabe-backend.vercel.app/">

  <!-- OpenGraph Meta Tags (Facebook & WhatsApp Preview) -->
  <meta property="og:locale" content="ar_IQ">
  <meta property="og:type" content="website">
  <meta property="og:title" content="🎓 منصة طلبتي التعليمية | ملازم ومناهج الثالث متوسط 2026">
  <meta property="og:description" content="النسخ الوزارية المعتمدة مع حلول التمارين والمرشحات. فتح أي مادة بـ 10,000 د.ع فقط عبر زين كاش وآسيا حوالة 07734378998.">
  <meta property="og:url" content="https://talabe-backend.vercel.app/">
  <meta property="og:site_name" content="منصة طلبتي">
  <meta name="theme-color" content="#2563eb">

  <!-- Mobile Web App Capable (PWA) -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="منصة طلبتي">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">

  <!-- Schema.org JSON-LD for Google Rich Results -->
  <script type="application/ld+json">
    ${JSON.stringify(structuredData)}
  </script>

  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --amber: #f59e0b;
      --emerald: #10b981;
      --bg: #0b0f19;
      --card-bg: #131b2e;
      --border: #1e293b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', sans-serif; -webkit-tap-highlight-color: transparent; }
    body { background: var(--bg); color: #f1f5f9; padding: 15px 12px 60px; line-height: 1.5; }
    .container { max-width: 1100px; margin: 0 auto; }
    
    /* Header & Badges */
    .header { text-align: center; margin: 15px 0 25px; }
    .header .verified-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(37,99,235,0.15); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd; padding: 4px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; margin-bottom: 12px; }
    .header h1 { font-size: 2.1rem; font-weight: 900; color: #fff; margin-bottom: 6px; letter-spacing: -0.5px; }
    .header h1 span { color: #60a5fa; }
    .header p { color: #94a3b8; font-size: 0.95rem; }

    /* Banner */
    .banner { background: linear-gradient(135deg, #1e1b4b, #1e3a8a, #2563eb); border-radius: 24px; padding: 22px; margin-bottom: 25px; text-align: center; border: 1px solid rgba(96,165,250,0.3); box-shadow: 0 12px 35px -10px rgba(37,99,235,0.4); position: relative; overflow: hidden; }
    .banner h2 { font-size: 1.4rem; font-weight: 900; margin-bottom: 8px; color: #fff; }
    .banner p { color: #dbeafe; font-size: 0.9rem; margin-bottom: 14px; }
    .phone-box { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.5); border: 1px solid #60a5fa; color: #93c5fd; padding: 7px 18px; border-radius: 999px; font-weight: bold; font-family: monospace; font-size: 1rem; }
    
    /* Top Action Buttons */
    .top-actions { display: flex; justify-content: center; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
    .btn-action { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 14px; font-weight: 800; font-size: 0.9rem; cursor: pointer; border: none; transition: 0.2s transform; }
    .btn-action:active { transform: scale(0.97); }
    .btn-code { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; box-shadow: 0 4px 15px rgba(245,158,11,0.3); }
    .btn-install { background: #1e293b; color: #38bdf8; border: 1px solid #334155; }

    /* Grid & Cards */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px; }
    .book-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; transition: 0.2s border-color; }
    .book-card:hover { border-color: #3b82f6; }
    .card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .category-badge { background: #1e3a8a; color: #93c5fd; font-size: 0.75rem; font-weight: bold; padding: 3px 10px; border-radius: 8px; }
    .rating-badge { background: rgba(245,158,11,0.15); color: #fbbf24; font-size: 0.75rem; font-weight: 900; padding: 3px 8px; border-radius: 8px; }
    .book-title { font-size: 1.15rem; font-weight: 900; color: #fff; margin-bottom: 8px; }
    .book-desc { font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 18px; flex-grow: 1; }
    .book-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #1e293b; padding-top: 14px; }
    .price-label { display: block; font-size: 0.7rem; color: #64748b; font-weight: bold; }
    .price-tag { font-size: 1.1rem; font-weight: 900; color: #34d399; }
    .btn-lock { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; border: none; padding: 9px 18px; border-radius: 12px; font-weight: 900; font-size: 0.85rem; cursor: pointer; }

    /* Modals */
    .modal-bg { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 100; align-items: center; justify-content: center; padding: 15px; }
    .modal-box { background: #131b2e; border: 1px solid #334155; border-radius: 24px; padding: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
    .form-inp { width: 100%; padding: 12px 14px; border-radius: 14px; background: #0b0f19; border: 1px solid #334155; color: #fff; margin-bottom: 12px; font-size: 0.9rem; outline: none; transition: 0.2s border; }
    .form-inp:focus { border-color: #60a5fa; }
    .btn-pay { width: 100%; background: #2563eb; color: #fff; border: none; padding: 14px; border-radius: 14px; font-weight: 900; font-size: 1rem; cursor: pointer; }
    .btn-wa { display: block; text-align: center; text-decoration: none; background: #16a34a; color: #fff; padding: 12px; border-radius: 14px; font-weight: bold; font-size: 0.9rem; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="verified-badge">✓ النسخة الوزارية المعتمدة 2026</div>
      <h1>🎓 منصة <span>طلبتي</span> التعليمية</h1>
      <p>المناهج والملازم والأسئلة الوزارية المعتمدة لطلاب الثالث متوسط بالعراق</p>
    </div>

    <div class="banner">
      <h2>جميع المواد مقفلة • سعر تفعيل أي مادة 10,000 د.ع فقط 🔒</h2>
      <p>يتم إرسال كود التفعيل فوراً عبر الواتساب بعد إتمام التحويل عبر زين كاش أو آسيا حوالة</p>
      <div class="phone-box">📲 رقم التحويل المعتمد: ${PAYMENT_INFO.supportPhone}</div>
    </div>

    <div class="top-actions">
      <button onclick="openCodeModal()" class="btn-action btn-code">🔑 تفعيل مادة بكود الاشتراك</button>
      <button onclick="promptInstallApp()" class="btn-action btn-install">📲 تثبيت التطبيق على الهاتف</button>
    </div>

    <div class="grid">${booksCards}</div>
  </div>

  <!-- Modal Payment -->
  <div id="payModal" class="modal-bg">
    <div class="modal-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3 id="modalTitle" style="font-weight:900; color:#fff;">طلب تفعيل المادة</h3>
        <button onclick="document.getElementById('payModal').style.display='none'" style="background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">✕</button>
      </div>

      <div style="background:#0b0f19; padding:14px; border-radius:14px; border:1px solid #334155; margin-bottom:15px; font-size:0.85rem;">
        <p style="color:#60a5fa; font-weight:bold; margin-bottom:6px;">💳 تفاصيل التحويل (المبلغ: 10,000 د.ع):</p>
        <p>زين كاش: <b style="color:#38bdf8; font-family:monospace;">${PAYMENT_INFO.zainCash}</b></p>
        <p>آسيا حوالة: <b style="color:#38bdf8; font-family:monospace;">${PAYMENT_INFO.asiaHawala}</b></p>
      </div>

      <form onsubmit="sendOrder(event)">
        <input id="stuName" class="form-inp" placeholder="اسم الطالب الثلاثي" required />
        <input id="stuPhone" class="form-inp" placeholder="رقم الهاتف (الواتساب)" required />
        <input id="stuTrans" class="form-inp" placeholder="رقم إشعار التحويل / رقم الوصل" required />
        <button type="submit" class="btn-pay">إرسال وتأكيد الطلب 🚀</button>
        <a id="waLink" href="https://wa.me/${PAYMENT_INFO.supportPhone}" target="_blank" class="btn-wa">📲 مراسلة الدعم الفني عبر الواتساب</a>
      </form>
    </div>
  </div>

  <!-- Modal Code -->
  <div id="codeModal" class="modal-bg">
    <div class="modal-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3 style="font-weight:900; color:#fff;">إدخال كود التفعيل 🔑</h3>
        <button onclick="document.getElementById('codeModal').style.display='none'" style="background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">✕</button>
      </div>
      <form onsubmit="redeemCode(event)">
        <input id="codeInp" class="form-inp" placeholder="مثال: TAL-VIP-2026" style="text-align:center; font-family:monospace; text-transform:uppercase; font-size:1.1rem;" required />
        <button type="submit" class="btn-pay">تفعيل وفتح المادة فوراً 🔓</button>
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
    function openCodeModal() {
      document.getElementById('codeModal').style.display = 'flex';
    }
    function promptInstallApp() {
      alert("📱 لتثبيت التطبيق على هاتفك:\n1. اضغط على زر الخيارات (⋮) في متصفح Chrome.\n2. اختر 'إضافة إلى الشاشة الرئيسية' أو 'Install App'.\nسيصبح التطبيق يعمل كبرنامج رسمي بهاتفك!");
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
      window.open('https://wa.me/${PAYMENT_INFO.supportPhone}?text=' + encodeURIComponent('مرحباً منصة طلبتي، حولت 10,000 د.ع لمادة (' + curBook + ') رقم الوصل: ' + transaction_ref), '_blank');
      document.getElementById('payModal').style.display = 'none';
    }
    async function redeemCode(e) {
      e.preventDefault();
      const code = document.getElementById('codeInp').value;
      const res = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) document.getElementById('codeModal').style.display = 'none';
    }
  </script>
</body>
</html>`;

  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🚀 خادم طلبتي يعمل بنجاح على المنفذ ' + PORT));
