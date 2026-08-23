// ==============================================================================================
// 🎓 منصة طلبتي التعليمية الشاملة - نظام التحقق برقم الهاتف ولوحة التحكم المحمية (2026)
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
    "background_color": "#070b14",
    "theme_color": "#090d16",
    "icons": [
      { "src": "https://img.icons8.com/fluency/192/graduation-cap.png", "sizes": "192x192", "type": "image/png" },
      { "src": "https://img.icons8.com/fluency/512/graduation-cap.png", "sizes": "512x512", "type": "image/png" }
    ]
  });
});

// قاعدة بيانات وهمية للملازم، المرشحات، والنشاطات
let BOOKS_DATABASE = [
  {
    id: "book-1",
    title: "الرياضيات - الثالث متوسط",
    subject: "الرياضيات",
    grade: "الثالث متوسط",
    year: "2026",
    author: "وزارة التربية / لجنة طلبتي",
    pages: "320 صفحة",
    size: "25 MB",
    rating: "4.9",
    desc: "الملزمة الشاملة لفصول الهندسة والمثلثات والمنشآت مع الأسئلة الوزارية.",
    badge: "الأعلى طلباً ⭐",
    cover: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

let FILTERS_DATABASE = [
  { id: "f-1", title: "مرشح الرياضيات الثالث متوسط", year: "2026", section: "الرياضيات" }
];

let ACTIVITIES = [
  { text: "تم إطلاق المنصة وتفعيل نظام التحقق برقم الهاتف", time: "الآن" }
];

// API Endpoints
app.get('/api/books', (req, res) => res.json(BOOKS_DATABASE));
app.get('/api/filters', (req, res) => res.json(FILTERS_DATABASE));
app.get('/api/stats', (req, res) => {
  res.json({
    students: "50,250",
    booksCount: BOOKS_DATABASE.length,
    sales: "125,500",
    filtersCount: FILTERS_DATABASE.length,
    activities: ACTIVITIES
  });
});

// Admin Authentication API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // بيانات دخول الأدمن الخاصة بك (يمكنك تغييرها هنا)
  if (username === "admin" && password === "ahmad_admin_2026") {
    res.json({ success: true, message: "تم تسجيل دخول الأدمن بنجاح!" });
  } else {
    res.status(401).json({ success: false, message: "اسم المستخدم أو كلمة مرور الأدمن غير صحيحة!" });
  }
});

app.post('/api/admin/add-book', (req, res) => {
  const { title, subject, grade, pages, desc, cover, pdfUrl } = req.body;
  const newBook = {
    id: 'book-' + Date.now(),
    title: title || "كتاب جديد",
    subject: subject || "عام",
    grade: grade || "الثالث متوسط",
    year: "2026",
    author: "لجنة طلبتي التخصصية",
    pages: pages || "100 صفحة",
    size: "15 MB",
    rating: "5.0",
    desc: desc || "وصف الكتاب...",
    badge: "جديد 🚀",
    cover: cover || "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60",
    pdfUrl: pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  };
  BOOKS_DATABASE.unshift(newBook);
  ACTIVITIES.unshift({ text: `تم إضافة كتاب جديد: ${newBook.title}`, time: "الآن" });
  res.json({ success: true, books: BOOKS_DATABASE });
});

app.post('/api/admin/delete-book', (req, res) => {
  const { bookId } = req.body;
  BOOKS_DATABASE = BOOKS_DATABASE.filter(b => b.id !== bookId);
  res.json({ success: true, books: BOOKS_DATABASE });
});

// الواجهة الأمامية الكاملة مع نظام OTP وإنشاء كلمة المرور ولوحة التحكم للأدمن
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>منصة طلبتي | الملازم الوزارية 2026</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#090d16">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Tajawal', 'Cairo', sans-serif; background-color: #070b14; color: #f1f5f9; }
    .glass-card { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.07); }
  </style>
</head>
<body class="min-h-screen pb-20 selection:bg-indigo-500 selection:text-white">

  <div class="flex min-h-screen">
    
    <!-- Sidebar -->
    <aside class="hidden lg:flex flex-col w-64 bg-[#090d16] border-l border-slate-800/80 p-5 sticky top-0 h-screen justify-between z-30">
      <div class="space-y-6">
        <div class="flex flex-col items-center text-center pb-6 border-b border-slate-800">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-3xl shadow-lg mb-3">🎓</div>
          <h2 class="text-lg font-black text-white">منصة طلبتي</h2>
          <p class="text-[11px] text-slate-400">الملازم الوزارية 2026</p>
          
          <div class="mt-4 flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 w-full">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400" id="sidebar-user-initial">ط</div>
            <div class="text-right truncate">
              <h4 class="text-xs font-bold text-white truncate" id="sidebar-user-name">زائر</h4>
              <p class="text-[10px] text-emerald-400" id="sidebar-user-role">غير مسجل</p>
            </div>
          </div>
        </div>

        <nav class="space-y-1.5 text-xs font-bold">
          <a href="#" onclick="switchTab('home')" id="nav-home" class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white shadow-lg transition">🏠 الرئيسية</a>
          <a href="#" onclick="switchTab('books')" id="nav-books" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-900 transition">📚 جميع الكتب</a>
          <a href="#" onclick="switchTab('admin')" id="nav-admin" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-amber-400 hover:bg-slate-900 transition border border-amber-500/20">⚙️ لوحة التحكم (أدمن)</a>
        </nav>
      </div>

      <button onclick="logoutUser()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition">🚪 تسجيل خروج</button>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      
      <!-- TAB 1: HOME -->
      <div id="tab-home" class="space-y-6">
        <div class="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 shadow-2xl">
          <div class="relative z-10 space-y-3 max-w-xl">
            <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">✨ مرحباً بك في منصة طلبتي</span>
            <h2 class="text-2xl sm:text-3xl font-black text-white">كل ما تحتاجه للنجاح في مكان واحد</h2>
            <p class="text-xs text-slate-300">تصفح أحدث الملازم والمرشحات الوزارية المضمونة 100%.</p>
            <button onclick="switchTab('books')" class="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg">تصفح الكتب 📚</button>
          </div>
        </div>
        <div>
          <h3 class="text-base font-black text-white mb-4">أحدث الكتب المضافة 📖</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4" id="home-books-grid"></div>
        </div>
      </div>

      <!-- TAB 2: BOOKS -->
      <div id="tab-books" class="space-y-6 hidden">
        <h3 class="text-lg font-black text-white">جميع الكتب الدراسية</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="all-books-grid"></div>
      </div>

      <!-- TAB 3: LOGIN / REGISTER (رقم الهاتف والرمز) -->
      <div id="tab-login" class="max-w-md mx-auto py-6 space-y-6">
        <div class="text-center space-y-2">
          <div class="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl mx-auto shadow-xl">📱</div>
          <h2 class="text-2xl font-black text-white">التسجيل برقم الهاتف</h2>
          <p class="text-xs text-slate-400">أدخل رقم هاتفك ليصلك رمز التحقق</p>
        </div>

        <!-- الخطوة 1: ادخال الهاتف -->
        <div id="step-phone" class="glass-card p-6 rounded-3xl space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف:</label>
            <input type="tel" id="input-phone" placeholder="07700000000" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none">
          </div>
          <button onclick="sendOtpCode()" class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg">إرسال رمز التحقق 📨</button>
          <div class="text-center pt-2">
            <button onclick="showAdminLogin()" class="text-amber-400 text-xs font-bold underline">تسجيل دخول الأدمن (المشرف) ⚙️</button>
          </div>
        </div>

        <!-- الخطوة 2: ادخال رمز التحقق OTP -->
        <div id="step-otp" class="glass-card p-6 rounded-3xl space-y-4 hidden">
          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs text-center font-bold" id="otp-hint">
            تم إرسال الرمز التجريبي: <span id="actual-otp" class="text-white font-mono text-sm">1234</span>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">أدخل رمز التحقق المكون من 4 أرقام:</label>
            <input type="text" id="input-otp" maxlength="4" placeholder="1234" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-center tracking-widest text-lg font-mono text-white focus:outline-none">
          </div>
          <button onclick="verifyOtpCode()" class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg">تأكيد الرمز ✅</button>
        </div>

        <!-- الخطوة 3: إنشاء كلمة المرور واسم الطالب -->
        <div id="step-password" class="glass-card p-6 rounded-3xl space-y-4 hidden">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">اسمك الكامل:</label>
            <input type="text" id="input-name" placeholder="أحمد محمد" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">أنشئ كلمة مرور خاصة بك:</label>
            <input type="password" id="input-password" placeholder="••••••••" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none">
          </div>
          <button onclick="completeRegistration()" class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg">حفظ ودخول المنصة 🚀</button>
        </div>

        <!-- تسجيل دخول الأدمن -->
        <div id="step-admin-login" class="glass-card p-6 rounded-3xl space-y-4 hidden">
          <h3 class="text-sm font-black text-amber-400">⚙️ تسجيل دخول الأدمن (المشرف)</h3>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">اسم المستخدم:</label>
            <input type="text" id="admin-user-input" value="admin" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">كلمة المرور الخاصة:</label>
            <input type="password" id="admin-pass-input" placeholder="أدخل كلمة المرور" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white">
          </div>
          <button onclick="submitAdminLogin()" class="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs">دخول لوحة التحكم 🔓</button>
          <div class="text-center pt-2">
            <button onclick="showPhoneLogin()" class="text-indigo-400 text-xs font-bold underline">العودة لتسجيل الطلاب 📱</button>
          </div>
        </div>

      </div>

      <!-- TAB 4: ADMIN PANEL (لوحة التحكم الخاصة بك) -->
      <div id="tab-admin" class="space-y-6 hidden">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 class="text-xl font-black text-amber-400">⚙️ لوحة تحكم الأدمن الخاصة بك</h3>
          <button onclick="logoutUser()" class="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-bold">خروج من الأدمن</button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-5 rounded-3xl glass-card space-y-1">
            <span class="text-xs text-slate-400">إجمالي الطلاب</span>
            <h3 class="text-2xl font-black text-indigo-400" id="stat-students">50,250</h3>
          </div>
          <div class="p-5 rounded-3xl glass-card space-y-1">
            <span class="text-xs text-slate-400">عدد الكتب</span>
            <h3 class="text-2xl font-black text-emerald-400" id="stat-books">1</h3>
          </div>
        </div>

        <!-- إضافة كتاب جديد -->
        <div class="glass-card p-6 rounded-3xl space-y-4">
          <h4 class="text-sm font-black text-white">➕ إضافة كتاب أو ملزمة جديدة للمنصة</h4>
          <form onsubmit="addNewBook(event)" class="space-y-3">
            <input type="text" id="new-title" required placeholder="عنوان الكتاب (مثال: الفيزياء الثالث متوسط)" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white">
            <input type="text" id="new-subject" required placeholder="المادة (فيزياء، رياضيات...)" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white">
            <input type="url" id="new-pdf" required placeholder="رابط ملف الـ PDF المباشر" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white">
            <textarea id="new-desc" placeholder="وصف الكتاب..." class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white h-20"></textarea>
            <button type="submit" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs">رفع الكتاب 🚀</button>
          </form>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-3">
          <h4 class="text-sm font-black text-white">🗑️ إدارة وحذف الكتب</h4>
          <div id="admin-books-list" class="space-y-2"></div>
        </div>
      </div>

    </main>
  </div>

  <script>
    let books = [];
    let generatedOtp = "";
    let tempPhone = "";

    async function loadData() {
      const res = await fetch('/api/books');
      books = await res.json();
      renderBooks();
    }

    function switchTab(tabId) {
      ['home', 'books', 'login', 'admin'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        if(el) el.classList.add('hidden');
        const nav = document.getElementById('nav-' + t);
        if(nav) nav.className = "flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-900 transition";
      });
      const target = document.getElementById('tab-' + tabId);
      if(target) target.classList.remove('hidden');
      const activeNav = document.getElementById('nav-' + tabId);
      if(activeNav) activeNav.className = "flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white shadow-lg transition";
    }

    function renderBooks() {
      document.getElementById('home-books-grid').innerHTML = books.map(b => \`
        <div class="glass-card p-3 rounded-2xl space-y-2">
          <img src="\${b.cover}" class="w-full h-28 object-cover rounded-xl" />
          <h4 class="text-xs font-bold text-white truncate">\${b.title}</h4>
          <a href="\${b.pdfUrl}" target="_blank" class="block text-center py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold">قراءة PDF 📖</a>
        </div>
      \`).join('');

      document.getElementById('all-books-grid').innerHTML = books.map(b => \`
        <div class="glass-card p-4 rounded-2xl space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">\${b.subject}</span>
            <h4 class="text-sm font-black text-white">\${b.title}</h4>
            <p class="text-xs text-slate-300">\${b.desc}</p>
          </div>
          <a href="\${b.pdfUrl}" target="_blank" class="block text-center py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">تحميل وقراءة 📥</a>
        </div>
      \`).join('');

      document.getElementById('admin-books-list').innerHTML = books.map(b => \`
        <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span class="text-white font-bold">\${b.title}</span>
          <button onclick="deleteBook('\${b.id}')" class="px-3 py-1 rounded bg-rose-600 text-white">حذف 🗑️</button>
        </div>
      \`).join('');

      document.getElementById('stat-books').innerText = books.length;
    }

    // دوال التسجيل بالهاتف والـ OTP
    function sendOtpCode() {
      const phone = document.getElementById('input-phone').value;
      if(!phone || phone.length < 10) {
        alert('الرجاء إدخال رقم هاتف صحيح!');
        return;
      }
      tempPhone = phone;
      generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      document.getElementById('actual-otp').innerText = generatedOtp;
      
      document.getElementById('step-phone').classList.add('hidden');
      document.getElementById('step-otp').classList.remove('hidden');
    }

    function verifyOtpCode() {
      const enteredOtp = document.getElementById('input-otp').value;
      if(enteredOtp === generatedOtp) {
        document.getElementById('step-otp').classList.add('hidden');
        document.getElementById('step-password').classList.remove('hidden');
      } else {
        alert('رمز التحقق غير صحيح! حاول مرة أخرى.');
      }
    }

    function completeRegistration() {
      const name = document.getElementById('input-name').value;
      const pass = document.getElementById('input-password').value;
      if(!name || !pass) {
        alert('الرجاء إكمال الاسم وكلمة المرور!');
        return;
      }
      localStorage.setItem('talabati_user', JSON.stringify({ name, phone: tempPhone, role: 'student' }));
      document.getElementById('sidebar-user-name').innerText = name;
      document.getElementById('sidebar-user-role').innerText = 'طالب';
      document.getElementById('sidebar-user-initial').innerText = name.charAt(0);
      
      alert('🌟 تم إنشاء الحساب بنجاح، أهلاً بك يا ' + name + '!');
      switchTab('home');
    }

    // دوال دخول الأدمن
    function showAdminLogin() {
      document.getElementById('step-phone').classList.add('hidden');
      document.getElementById('step-admin-login').classList.remove('hidden');
    }
    function showPhoneLogin() {
      document.getElementById('step-admin-login').classList.add('hidden');
      document.getElementById('step-phone').classList.remove('hidden');
    }

    async function submitAdminLogin() {
      const username = document.getElementById('admin-user-input').value;
      const password = document.getElementById('admin-pass-input').value;

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if(data.success) {
        localStorage.setItem('talabati_user', JSON.stringify({ name: 'المشرف أحمد', role: 'admin' }));
        document.getElementById('sidebar-user-name').innerText = 'المشرف أحمد';
        document.getElementById('sidebar-user-role').innerText = 'أدمن ⚙️';
        alert('✅ تم تسجيل دخول لوحة التحكم بنجاح!');
        switchTab('admin');
      } else {
        alert('❌ ' + data.message);
      }
    }

    async function addNewBook(e) {
      e.preventDefault();
      const title = document.getElementById('new-title').value;
      const subject = document.getElementById('new-subject').value;
      const pdfUrl = document.getElementById('new-pdf').value;
      const desc = document.getElementById('new-desc').value;

      const res = await fetch('/api/admin/add-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, pdfUrl, desc })
      });
      const data = await res.json();
      if(data.success) {
        books = data.books;
        renderBooks();
        e.target.reset();
        alert('✅ تم رفع الكتاب بنجاح!');
      }
    }

    async function deleteBook(id) {
      if(!confirm('هل أنت متأكد من الحذف؟')) return;
      const res = await fetch('/api/admin/delete-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: id })
      });
      const data = await res.json();
      if(data.success) {
        books = data.books;
        renderBooks();
      }
    }

    function logoutUser() {
      localStorage.removeItem('talabati_user');
      location.reload();
    }

    // التحقق عند الإقلاع
    const savedUser = JSON.parse(localStorage.getItem('talabati_user') || 'null');
    if(savedUser) {
      document.getElementById('sidebar-user-name').innerText = savedUser.name;
      document.getElementById('sidebar-user-role').innerText = savedUser.role === 'admin' ? 'أدمن ⚙️' : 'طالب';
      document.getElementById('sidebar-user-initial').innerText = savedUser.name.charAt(0);
      if(savedUser.role === 'admin') {
        // يمكنه الوصول للأدمن مباشرة
      }
    } else {
      switchTab('login');
    }

    loadData();
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
