// ==============================================================================================
// 🎓 منصة طلبتي التعليمية - النسخة الشاملة مع لوحة التحكم وتسجيل الدخول (2026)
// ==============================================================================================

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 📱 ملف مانيفست الـ PWA
app.get('/manifest.json', (req, res) => {
  res.json({
    "name": "منصة طلبتي التعليمية",
    "short_name": "طلبتي",
    "description": "منصة طلبتي التعليمية للملازم والمرشحات الوزارية المختصرة 2026",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#020617",
    "theme_color": "#0f172a",
    "icons": [
      { "src": "https://img.icons8.com/fluency/192/graduation-cap.png", "sizes": "192x192", "type": "image/png" },
      { "src": "https://img.icons8.com/fluency/512/graduation-cap.png", "sizes": "512x512", "type": "image/png" }
    ]
  });
});

// 📚 قاعدة بيانات الكتب والمرشحات (تتحدث ديناميكياً من لوحة التحكم)
let BOOKS_DATABASE = [
  {
    id: "ar-grammar",
    title: "ملزمة قواعد اللغة العربية المركزة والذكية",
    subject: "لغة عربية",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "120 صفحة",
    price: "10,000 د.ع",
    desc: "أقوى ملخص لقواعد الثالث المتوسط مع إعراب الأمثلة والتمارين الوزارية.",
    badge: "الأعلى طلباً ⭐",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "math-p1",
    title: "مرشحات الرياضيات الذهبية (الجزء الأول)",
    subject: "رياضيات",
    author: "إعداد: لجنة طلبتي التخصصية 🌟",
    pages: "100 صفحة",
    price: "10,000 د.ع",
    desc: "أهم الأسئلة الوزارية المكررة للفصول الثلاثة الأولى.",
    badge: "مرشحات مؤكدة 🔥",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

// ⚙️ استقبال طلبات لوحة التحكم (إضافة كتاب/ملزمة جديدة مع رابط ملف الـ PDF)
app.post('/api/admin/add-book', (req, res) => {
  const { secretKey, title, subject, pages, price, desc, badge, pdfUrl } = req.body;
  
  // كلمة مرور الأدمن السرية الخاصة بك
  if (secretKey !== "AHMAD2026ADMIN") {
    return res.status(401).json({ success: false, message: "كلمة مرور لوحة التحكم غير صحيحة!" });
  }

  const newBook = {
    id: 'book-' + Date.now(),
    title,
    subject,
    author: "إعداد: الأستاذ أحمد / لجنة طلبتي 🌟",
    pages: pages || "100 صفحة",
    price: price || "10,000 د.ع",
    desc,
    badge: badge || "جديد 🚀",
    pdfUrl: pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  };

  BOOKS_DATABASE.unshift(newBook);
  res.json({ success: true, message: "تم إضافة الكتاب/المرشحة بنجاح تام!", books: BOOKS_DATABASE });
});

// 🗑️ حذف كتاب أو مرشحة من لوحة التحكم
app.post('/api/admin/delete-book', (req, res) => {
  const { secretKey, bookId } = req.body;
  if (secretKey !== "AHMAD2026ADMIN") {
    return res.status(401).json({ success: false, message: "غير مخول بالحذف!" });
  }

  BOOKS_DATABASE = BOOKS_DATABASE.filter(b => b.id !== bookId);
  res.json({ success: true, message: "تم حذف الكتاب بنجاح!", books: BOOKS_DATABASE });
});

// جلب الكتب للواجهة
app.get('/api/books', (req, res) => {
  res.json(BOOKS_DATABASE);
});

// الواجهة الرئيسية والدمج الكامل
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>🎓 منصة طلبتي التعليمية | المتجر الرسمي للملازم والمرشحات 2026</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0f172a">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    body { font-family: 'Tajawal', 'Cairo', sans-serif; }
    .glass-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen pb-24 selection:bg-amber-500 selection:text-slate-950">

  <!-- Header -->
  <header class="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">🎓</div>
        <div>
          <h1 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
            منصة طلبتي الذكية
            <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">2026</span>
          </h1>
          <p class="text-[11px] text-emerald-400 font-bold" id="user-status-display">✨ أهلاً بك يا بطل (غير مسجل)</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="openLoginModal()" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg">
          <span>👤 تسجيل دخول</span>
        </button>
        <button onclick="openAdminModal()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer">
          <span>⚙️ لوحة التحكم</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto px-4 py-6 space-y-8">
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="space-y-3 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>دعم الملازم والمرشحات الوزارية المضمونة 100%</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white leading-tight">
          طريقك للتفوق والـ 100 مع <span class="text-amber-400">مرشحات طلبتي</span> 🏆
        </h2>
        <p class="text-xs sm:text-sm text-slate-300">
          تصفح أقوى الملازم والمرشحات المختصرة، وقم بتفعيل مادتك فوراً عبر كود التفعيل أو الدعم المباشر.
        </p>
      </div>
      <button onclick="scrollToBooks()" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl transition transform hover:scale-105 cursor-pointer shrink-0">
        📚 تصفح جميع الملازم
      </button>
    </div>

    <div>
      <h3 class="text-lg sm:text-xl font-black text-white mb-6">📚 قائمة الملازم والمرشحات المتاحة حالياً:</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="books-grid"></div>
    </div>
  </main>

  <!-- Login Modal (تسجيل الدخول برقم الهاتف) -->
  <div id="login-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden">
    <div class="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl relative">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-black text-white">👤 تسجيل الدخول برقم الهاتف</h3>
        <button onclick="closeModal('login-modal')" class="text-slate-400 hover:text-white cursor-pointer">✕</button>
      </div>
      <form onsubmit="handlePhoneLogin(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">اسم الطالب:</label>
          <input type="text" id="login-name" required placeholder="مثال: أحمد سامي" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف (للتحقق):</label>
          <input type="tel" id="login-phone" required placeholder="07700000000" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500">
        </div>
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg cursor-pointer">تسجيل الدخول وبدء الدراسة 🚀</button>
      </form>
    </div>
  </div>

  <!-- Admin Modal (لوحة التحكم الخاصة بك لإضافة وحذف الكتب والمرشحات) -->
  <div id="admin-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
    <div class="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl my-6">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-black text-amber-400">⚙️ لوحة تحكم الأدمن (إضافة / حذف الكتب)</h3>
        <button onclick="closeModal('admin-modal')" class="text-slate-400 hover:text-white cursor-pointer">✕</button>
      </div>

      <div id="admin-login-box" class="space-y-4">
        <p class="text-xs text-slate-300">أدخل كلمة مرور الأدمن السرية للوصول إلى لوحة التحكم:</p>
        <input type="password" id="admin-secret-input" placeholder="كلمة المرور السرية" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none">
        <button onclick="verifyAdmin()" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs cursor-pointer">دخول لوحة التحكم 🔓</button>
      </div>

      <div id="admin-dashboard-box" class="space-y-4 hidden">
        <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          ✅ تم تسجيل الدخول كمسؤول بنجاح! يمكنك الآن إضافة مرشحات جديدة أو حذف الكتب.
        </div>
        
        <form onsubmit="handleAddNewBook(event)" class="space-y-3 border-t border-slate-800 pt-4">
          <h4 class="text-xs font-black text-white">➕ إضافة ملزمة أو مرشحة جديدة:</h4>
          <input type="text" id="new-title" required placeholder="عنوان الملزمة (مثال: مرشحات الفيزياء)" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
          <div class="grid grid-cols-2 gap-2">
            <input type="text" id="new-subject" required placeholder="المادة (فيزياء، رياضيات...)" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
            <input type="text" id="new-pages" placeholder="عدد الصفحات (مثال: 90 صفحة)" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
          </div>
          <input type="text" id="new-desc" required placeholder="وصف مختصر للملزمة" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
          <input type="text" id="new-badge" placeholder="شارة التميز (مثال: مرشحات وزارية 🔥)" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
          <input type="url" id="new-pdf" placeholder="رابط ملف PDF للملزمة (رابط مباشر)" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
          
          <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs cursor-pointer">رفع وإضافة الملزمة للمنصة 🚀</button>
        </form>

        <div class="border-t border-slate-800 pt-4">
          <h4 class="text-xs font-black text-white mb-2">🗑️ إدارة وحذف الكتب الحالية:</h4>
          <div id="admin-books-list" class="space-y-2 max-h-40 overflow-y-auto"></div>
        </div>
      </div>
    </div>
  </div>

  <footer class="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-900">
    <p>منصة طلبتي التعليمية الذكية © 2026 • لوحة التحكم الفعالة 🇮🇶</p>
  </footer>

  <script>
    let currentBooks = [];
    let currentUser = JSON.parse(localStorage.getItem('talabati_user') || 'null');
    let adminSecret = "";

    if(currentUser) {
      document.getElementById('user-status-display').innerText = '✨ أهلاً بك، ' + currentUser.name;
    }

    async function fetchBooks() {
      const res = await fetch('/api/books');
      currentBooks = await res.json();
      renderBooks();
    }

    function renderBooks() {
      const grid = document.getElementById('books-grid');
      grid.innerHTML = currentBooks.map(book => \`
        <div class="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">\${book.subject} • \${book.pages}</span>
              <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">\${book.badge}</span>
            </div>
            <h4 class="text-base font-black text-white leading-snug">\${book.title}</h4>
            <p class="text-xs text-amber-400 font-bold">\${book.author}</p>
            <p class="text-xs text-slate-300 line-clamp-2">\${book.desc}</p>
          </div>
          <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <span class="text-sm font-black font-mono text-emerald-400">\${book.price}</span>
            <a href="\${book.pdfUrl}" target="_blank" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg cursor-pointer">فتح وقراءة PDF 📖</a>
          </div>
        </div>
      \`).join('');
    }

    function scrollToBooks() { document.getElementById('books-grid').scrollIntoView({ behavior: 'smooth' }); }
    function openLoginModal() { document.getElementById('login-modal').classList.remove('hidden'); }
    function openAdminModal() { document.getElementById('admin-modal').classList.remove('hidden'); }
    function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

    function handlePhoneLogin(e) {
      e.preventDefault();
      const name = document.getElementById('login-name').value;
      const phone = document.getElementById('login-phone').value;
      currentUser = { name, phone };
      localStorage.setItem('talabati_user', JSON.stringify(currentUser));
      document.getElementById('user-status-display').innerText = '✨ أهلاً بك، ' + name;
      alert('🌟 أهلاً بك يا ' + name + '! تم تسجيل دخولك بنجاح.');
      closeModal('login-modal');
    }

    function verifyAdmin() {
      const secret = document.getElementById('admin-secret-input').value;
      if (secret === "AHMAD2026ADMIN") {
        adminSecret = secret;
        document.getElementById('admin-login-box').classList.add('hidden');
        document.getElementById('admin-dashboard-box').classList.remove('hidden');
        renderAdminBooksList();
      } else {
        alert('❌ كلمة المرور غير صحيحة!');
      }
    }

    async function handleAddNewBook(e) {
      e.preventDefault();
      const title = document.getElementById('new-title').value;
      const subject = document.getElementById('new-subject').value;
      const pages = document.getElementById('new-pages').value;
      const desc = document.getElementById('new-desc').value;
      const badge = document.getElementById('new-badge').value;
      const pdfUrl = document.getElementById('new-pdf').value;

      const res = await fetch('/api/admin/add-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: adminSecret, title, subject, pages, desc, badge, pdfUrl })
      });
      const data = await res.json();
      if(data.success) {
        currentBooks = data.books;
        renderBooks();
        renderAdminBooksList();
        alert('✅ ' + data.message);
        e.target.reset();
      } else {
        alert('❌ ' + data.message);
      }
    }

    function renderAdminBooksList() {
      const list = document.getElementById('admin-books-list');
      list.innerHTML = currentBooks.map(book => \`
        <div class="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
          <span class="font-bold text-white truncate max-w-[200px]">\${book.title}</span>
          <button onclick="deleteBook('\${book.id}')" class="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer">حذف 🗑️</button>
        </div>
      \`).join('');
    }

    async function deleteBook(bookId) {
      if(!confirm('هل أنت متأكد من حذف هذا الكتاب؟')) return;
      const res = await fetch('/api/admin/delete-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: adminSecret, bookId })
      });
      const data = await res.json();
      if(data.success) {
        currentBooks = data.books;
        renderBooks();
        renderAdminBooksList();
        alert('🗑️ تم الحذف بنجاح');
      }
    }

    fetchBooks();
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
