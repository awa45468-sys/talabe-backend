// ==============================================================================================
// 🎓 منصة طلبتي التعليمية الشاملة - الإصدار الاحترافي المطابق للتصميم (2026)
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

// 📚 قاعدة البيانات المبدئية للكتب والمرشحات
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
    desc: "الملزمة الشاملة لفصول الهندسة والمثنات والمنشات والمهسمات مع الأسئلة الوزارية.",
    badge: "الأعلى طلباً ⭐",
    cover: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "book-2",
    title: "اللغة العربية - الثالث متوسط",
    subject: "اللغة العربية",
    grade: "الثالث متوسط",
    year: "2026",
    author: "وزارة التربية / لجنة طلبتي",
    pages: "180 صفحة",
    size: "15 MB",
    rating: "4.8",
    desc: "ملزمة قواعد اللغة العربية المركزة والذكية مع إعراب الأمثلة والتمارين الوزارية.",
    badge: "مرشحات مؤكدة 🔥",
    cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop&q=60",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "book-3",
    title: "اللغة الإنجليزية - الثالث متوسط",
    subject: "اللغة الإنجليزية",
    grade: "الثالث متوسط",
    year: "2026",
    author: "وزارة التربية / لجنة طلبتي",
    pages: "190 صفحة",
    size: "18 MB",
    rating: "4.8",
    desc: "تضم القواعد، القطع الاستيعابية، والإنشاءات الوزارية المرشحة والمبسطة.",
    badge: "شاملة القواعد 📚",
    cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

let FILTERS_DATABASE = [
  { id: "f-1", title: "مرشح الرياضيات الثالث متوسط", year: "2026", section: "الرياضيات" },
  { id: "f-2", title: "مرشح الفيزياء الثالث متوسط", year: "2026", section: "الفيزياء" },
  { id: "f-3", title: "مرشح الكيمياء الثالث متوسط", year: "2026", section: "الكيمياء" },
  { id: "f-4", title: "مرشح اللغة العربية الثالث متوسط", year: "2026", section: "اللغة العربية" }
];

let ACTIVITIES = [
  { text: "تم إضافة كتاب جديد: الرياضيات الثالث متوسط", time: "منذ 5 دقيقة" },
  { text: "تم إضافة مرشح جديد: مرشح الفيزياء الثالث متوسط", time: "منذ 7 دقيقة" },
  { text: "تم حذف كتاب: العلوم: الرابع علمي", time: "منذ 9 دقيقة" }
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

app.post('/api/admin/add-book', (req, res) => {
  const { title, subject, grade, year, pages, desc, cover, pdfUrl } = req.body;
  const newBook = {
    id: 'book-' + Date.now(),
    title: title || "كتاب جديد",
    subject: subject || "عام",
    grade: grade || "الثالث متوسط",
    year: year || "2026",
    author: "لجنة طلبتي التخصصية",
    pages: pages || "100 صفحة",
    size: "15 MB",
    rating: "5.0",
    desc: desc || "وصف الكتاب الجديد هنا...",
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
  const book = BOOKS_DATABASE.find(b => b.id === bookId);
  if(book) {
    ACTIVITIES.unshift({ text: `تم حذف كتاب: ${book.title}`, time: "الآن" });
  }
  BOOKS_DATABASE = BOOKS_DATABASE.filter(b => b.id !== bookId);
  res.json({ success: true, books: BOOKS_DATABASE });
});

app.post('/api/admin/add-filter', (req, res) => {
  const { title, year, section } = req.body;
  const newFilter = {
    id: 'filter-' + Date.now(),
    title: title || "مرشح وزاري جديد",
    year: year || "2026",
    section: section || "عام"
  };
  FILTERS_DATABASE.unshift(newFilter);
  ACTIVITIES.unshift({ text: `تم إضافة مرشح جديد: ${newFilter.title}`, time: "الآن" });
  res.json({ success: true, filters: FILTERS_DATABASE });
});

app.post('/api/admin/delete-filter', (req, res) => {
  const { filterId } = req.body;
  FILTERS_DATABASE = FILTERS_DATABASE.filter(f => f.id !== filterId);
  res.json({ success: true, filters: FILTERS_DATABASE });
});

// الواجهة الرئيسية الكاملة مطابقة تماماً للتصميم
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
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  </style>
</head>
<body class="min-h-screen pb-20 selection:bg-indigo-500 selection:text-white">

  <!-- Desktop Sidebar & Mobile Header Layout -->
  <div class="flex min-h-screen">
    
    <!-- Sidebar (Desktop & Drawer) -->
    <aside class="hidden lg:flex flex-col w-64 bg-[#090d16] border-l border-slate-800/80 p-5 sticky top-0 h-screen justify-between z-30">
      <div class="space-y-6">
        <div class="flex flex-col items-center text-center pb-6 border-b border-slate-800">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-3xl shadow-lg mb-3">🎓</div>
          <h2 class="text-lg font-black text-white">منصة طلبتي</h2>
          <p class="text-[11px] text-slate-400">الملازم الوزارية 2026</p>
          
          <div class="mt-4 flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 w-full">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">أحمد</div>
            <div class="text-right">
              <h4 class="text-xs font-bold text-white">أحمد محمد</h4>
              <p class="text-[10px] text-emerald-400">طالب</p>
            </div>
          </div>
        </div>

        <nav class="space-y-1.5 text-xs font-bold">
          <a href="#" onclick="switchTab('home')" id="nav-home" class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white shadow-lg transition">🏠 الرئيسية</a>
          <a href="#" onclick="switchTab('books')" id="nav-books" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-900 transition">📚 جميع الكتب</a>
          <a href="#" onclick="switchTab('filters')" id="nav-filters" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-900 transition">⚡ المرشحات</a>
          <a href="#" onclick="switchTab('admin')" id="nav-admin" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-amber-400 hover:bg-slate-900 transition border border-amber-500/20">⚙️ لوحة التحكم</a>
        </nav>
      </div>

      <button onclick="switchTab('login')" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition">🚪 تسجيل خروج</button>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      
      <!-- Top Mobile Header bar -->
      <header class="flex items-center justify-between lg:hidden pb-4 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl">🎓</div>
          <div>
            <h1 class="text-sm font-black text-white">منصة طلبتي</h1>
            <p class="text-[10px] text-slate-400">الملازم الوزارية 2026</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="switchTab('admin')" class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-xs">⚙️</button>
          <button onclick="switchTab('login')" class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 text-xs">👤</button>
        </div>
      </header>

      <!-- TAB 1: HOME -->
      <div id="tab-home" class="space-y-6">
        <div class="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 shadow-2xl overflow-hidden">
          <div class="relative z-10 space-y-3 max-w-xl">
            <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">✨ مرحباً بك في منصة طلبتي</span>
            <h2 class="text-2xl sm:text-3xl font-black text-white">كل ما تحتاجه النجاح في مكان واحد</h2>
            <p class="text-xs text-slate-300">تصفح أحدث الملازم والمرشحات الوزارية المضمونة 100% لإتمام دراستك.</p>
            <button onclick="switchTab('books')" class="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg transition">تصفح الكتب 📚</button>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-4 rounded-2xl glass-card"><h4 class="text-base font-black text-indigo-400">90k+</h4><p class="text-[11px] text-slate-400">الطلاب</p></div>
          <div class="p-4 rounded-2xl glass-card"><h4 class="text-base font-black text-blue-400">هواد دراسية</h4><p class="text-[11px] text-slate-400">5 مواد</p></div>
          <div class="p-4 rounded-2xl glass-card"><h4 class="text-base font-black text-amber-400">120+</h4><p class="text-[11px] text-slate-400">المرشحات</p></div>
          <div class="p-4 rounded-2xl glass-card"><h4 class="text-base font-black text-emerald-400">250+</h4><p class="text-[11px] text-slate-400">الكتب المتاحة</p></div>
        </div>

        <div>
          <h3 class="text-base font-black text-white mb-4">أحدث الكتب المضافة 📖</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4" id="home-books-grid"></div>
        </div>
      </div>

      <!-- TAB 2: BOOKS -->
      <div id="tab-books" class="space-y-6 hidden">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-black text-white">جميع الكتب الدراسية</h3>
          <button onclick="openAddBookModal()" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">+ إضافة كتاب جديد</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="all-books-grid"></div>
      </div>

      <!-- TAB 3: FILTERS -->
      <div id="tab-filters" class="space-y-6 hidden">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-black text-white">⚡ إدارة وتصفح المرشحات الوزارية</h3>
          <button onclick="openAddFilterModal()" class="px-4 py-2 rounded-xl bg-amber-600 text-slate-950 text-xs font-black">+ إضافة مرشح جديد</button>
        </div>
        <div class="space-y-3" id="filters-list-container"></div>
      </div>

      <!-- TAB 4: ADMIN PANEL -->
      <div id="tab-admin" class="space-y-6 hidden">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 class="text-xl font-black text-amber-400 flex items-center gap-2">⚙️ لوحة تحكم الإدارة الشاملة</h3>
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">مشرف معتمد</span>
        </div>

        <!-- Admin Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 rounded-3xl glass-card space-y-1">
            <span class="text-xs text-slate-400">إجمالي الطلاب</span>
            <h3 class="text-2xl font-black text-indigo-400" id="stat-students">50,250</h3>
            <p class="text-[10px] text-emerald-400">+2,350 هذا الشهر</p>
          </div>
          <div class="p-5 rounded-3xl glass-card space-y-1">
            <span class="text-xs text-slate-400">إجمالي المبيعات</span>
            <h3 class="text-2xl font-black text-emerald-400" id="stat-sales">125,500 د.ع</h3>
            <p class="text-[10px] text-emerald-400">+5,200 هذا الشهر</p>
          </div>
        </div>

        <!-- Admin Quick Actions -->
        <div class="p-5 rounded-3xl glass-card space-y-4">
          <h4 class="text-sm font-black text-white">الإجراءات السريعة</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button onclick="openAddBookModal()" class="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">➕ إضافة كتاب جديد</button>
            <button onclick="openAddFilterModal()" class="p-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black transition">⚡ إضافة مرشح جديد</button>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="p-5 rounded-3xl glass-card space-y-4">
          <h4 class="text-sm font-black text-white">آخر النشاطات</h4>
          <div class="space-y-2.5" id="activities-container"></div>
        </div>
      </div>

      <!-- TAB 5: LOGIN -->
      <div id="tab-login" class="max-w-md mx-auto py-10 space-y-6 hidden">
        <div class="text-center space-y-2">
          <div class="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl mx-auto shadow-xl">🎓</div>
          <h2 class="text-2xl font-black text-white">تسجيل الدخول</h2>
          <p class="text-xs text-slate-400">منصة طلبتي الوزارية 2026</p>
        </div>
        <form onsubmit="handleLoginSubmit(event)" class="glass-card p-6 rounded-3xl space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني أو اسم المستخدم:</label>
            <input type="text" required placeholder="ahmad@talabati.app" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">كلمة المرور:</label>
            <input type="password" required placeholder="••••••••" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none">
          </div>
          <button type="submit" class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg">تسجيل الدخول 🚀</button>
        </form>
      </div>

    </main>
  </div>

  <!-- BOOK DETAILS MODAL -->
  <div id="book-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden">
    <div class="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-black text-white">تفاصيل الكتاب</h3>
        <button onclick="closeBookModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <div id="modal-book-content" class="space-y-4"></div>
    </div>
  </div>

  <!-- ADD BOOK MODAL -->
  <div id="add-book-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden">
    <div class="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-black text-white">➕ إضافة كتاب جديد</h3>
        <button onclick="closeAddBookModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <form onsubmit="submitNewBook(event)" class="space-y-3">
        <input type="text" id="add-title" required placeholder="اسم الكتاب (مثال: الفيزياء - الثالث متوسط)" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
        <input type="text" id="add-subject" required placeholder="المادة (فيزياء، رياضيات...)" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
        <input type="text" id="add-pages" placeholder="عدد الصفحات (مثال: 200 صفحة)" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
        <input type="url" id="add-cover" placeholder="رابط صورة الغلاف (صورة مباشرة)" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
        <input type="url" id="add-pdf" placeholder="رابط ملف PDF" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
        <textarea id="add-desc" placeholder="وصف مختصر للكتاب..." class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white h-20"></textarea>
        <button type="submit" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs">إضافة الكتاب للمنصة 🚀</button>
      </form>
    </div>
  </div>

  <!-- ADD FILTER MODAL -->
  <div id="add-filter-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden">
    <div class="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-black text-amber-400">⚡ إضافة مرشح جديد</h3>
        <button onclick="closeAddFilterModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <form onsubmit="submitNewFilter(event)" class="space-y-3">
        <input type="text" id="filter-title" required placeholder="عنوان المرشح (مثال: مرشح الأحياء الثالث متوسط)" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
        <input type="text" id="filter-section" required placeholder="القسم أو المادة (أحياء، رياضيات...)" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
        <button type="submit" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs">حفظ وإضافة المرشح 🚀</button>
      </form>
    </div>
  </div>

  <script>
    let books = [];
    let filters = [];
    let stats = {};

    async function loadData() {
      const resBooks = await fetch('/api/books');
      books = await resBooks.json();

      const resFilters = await fetch('/api/filters');
      filters = await resFilters.json();

      const resStats = await fetch('/api/stats');
      stats = await resStats.json();

      renderAll();
    }

    function switchTab(tabId) {
      ['home', 'books', 'filters', 'admin', 'login'].forEach(t => {
        document.getElementById('tab-' + t).classList.add('hidden');
        const nav = document.getElementById('nav-' + t);
        if(nav) nav.className = "flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-900 transition";
      });
      document.getElementById('tab-' + tabId).classList.remove('hidden');
      const activeNav = document.getElementById('nav-' + tabId);
      if(activeNav) activeNav.className = "flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white shadow-lg transition";
    }

    function renderAll() {
      // Home books grid
      document.getElementById('home-books-grid').innerHTML = books.slice(0, 4).map(b => \`
        <div onclick="openBookModal('\${b.id}')" class="glass-card p-3 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition space-y-2">
          <img src="\${b.cover}" class="w-full h-28 object-cover rounded-xl" />
          <h4 class="text-xs font-bold text-white truncate">\${b.title}</h4>
          <span class="text-[10px] text-indigo-400">\${b.grade}</span>
        </div>
      \`).join('');

      // All books grid
      document.getElementById('all-books-grid').innerHTML = books.map(b => \`
        <div class="glass-card p-4 rounded-2xl space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">\${b.subject}</span>
              <span class="text-amber-400 text-xs font-bold">⭐ \${b.rating}</span>
            </div>
            <h4 class="text-sm font-black text-white">\${b.title}</h4>
            <p class="text-xs text-slate-300 line-clamp-2">\${b.desc}</p>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-800">
            <button onclick="openBookModal('\&quot;\${b.id}\&quot;'.replace(/\"/g, ''))" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">التفاصيل 📖</button>
            <button onclick="deleteBook('\${b.id}')" class="text-rose-400 hover:text-rose-300 text-xs font-bold">حذف 🗑️</button>
          </div>
        </div>
      \`).join('');

      // Filters list
      document.getElementById('filters-list-container').innerHTML = filters.map(f => \`
        <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <h4 class="text-xs font-black text-white">\${f.title}</h4>
            <span class="text-[10px] text-amber-400">قسم: \${f.section} • سنة \${f.year}</span>
          </div>
          <button onclick="deleteFilter('\${f.id}')" class="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">حذف 🗑️</button>
        </div>
      \`).join('');

      // Admin stats & activities
      document.getElementById('stat-students').innerText = stats.students;
      document.getElementById('stat-sales').innerText = stats.sales + " د.ع";
      document.getElementById('activities-container').innerHTML = (stats.activities || []).map(act => \`
        <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-200">\${act.text}</span>
          <span class="text-[10px] text-slate-500">\${act.time}</span>
        </div>
      \`).join('');
    }

    function openBookModal(id) {
      const b = books.find(x => x.id === id);
      if(!b) return;
      document.getElementById('modal-book-content').innerHTML = \`
        <img src="\${b.cover}" class="w-full h-48 object-cover rounded-2xl" />
        <h3 class="text-base font-black text-white">\${b.title}</h3>
        <p class="text-xs text-slate-300">\${b.desc}</p>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl">
          <div>سنة النشر: \${b.year}</div>
          <div>المؤلف: \${b.author}</div>
          <div>عدد الصفحات: \${b.pages}</div>
          <div>الحجم: \${b.size}</div>
        </div>
        <a href="\${b.pdfUrl}" target="_blank" class="block text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg">تحميل وقراءة الكتاب 📥</a>
      \`;
      document.getElementById('book-modal').classList.remove('hidden');
    }

    function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }
    function openAddBookModal() { document.getElementById('add-book-modal').classList.remove('hidden'); }
    function closeAddBookModal() { document.getElementById('add-book-modal').classList.add('hidden'); }
    function openAddFilterModal() { document.getElementById('add-filter-modal').classList.remove('hidden'); }
    function closeAddFilterModal() { document.getElementById('add-filter-modal').classList.add('hidden'); }

    async function submitNewBook(e) {
      e.preventDefault();
      const title = document.getElementById('add-title').value;
      const subject = document.getElementById('add-subject').value;
      const pages = document.getElementById('add-pages').value;
      const cover = document.getElementById('add-cover').value;
      const pdfUrl = document.getElementById('add-pdf').value;
      const desc = document.getElementById('add-desc').value;

      const res = await fetch('/api/admin/add-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, pages, cover, pdfUrl, desc })
      });
      const data = await res.json();
      if(data.success) {
        books = data.books;
        closeAddBookModal();
        loadData();
        alert('✅ تم إضافة الكتاب بنجاح!');
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
        loadData();
      }
    }

    async function submitNewFilter(e) {
      e.preventDefault();
      const title = document.getElementById('filter-title').value;
      const section = document.getElementById('filter-section').value;

      const res = await fetch('/api/admin/add-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, section, year: '2026' })
      });
      const data = await res.json();
      if(data.success) {
        filters = data.filters;
        closeAddFilterModal();
        loadData();
        alert('⚡ تم إضافة المرشح بنجاح!');
      }
    }

    async function deleteFilter(id) {
      if(!confirm('هل أنت متأكد من حذف المرشح؟')) return;
      const res = await fetch('/api/admin/delete-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filterId: id })
      });
      const data = await res.json();
      if(data.success) {
        filters = data.filters;
        loadData();
      }
    }

    function handleLoginSubmit(e) {
      e.preventDefault();
      alert('🌟 أهلاً بك يا أحمد! تم تسجيل الدخول بنجاح.');
      switchTab('home');
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
