// ==============================================================================================
// 🎓 منصة طلبتي التعليمية - المتجر الرسمي للملازم والمرشحات الذكية 2026 (محدث ليدعم PWA/APK)
// ==============================================================================================

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 📱 ملف مانيفست الـ PWA ليتوافق مع PWABuilder ويستخرج الـ APK بنجاح
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
      {
        "src": "https://img.icons8.com/fluency/192/graduation-cap.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "https://img.icons8.com/fluency/512/graduation-cap.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  });
});

// 💳 إعدادات الدفع الرسمية للمنصة
const PAYMENT_CONFIG = {
  rafidainCard: "910160728184",
  asiaHawala: "07734378998",
  zainCash: "07734378998",
  supportPhone: "9647734378998",
  price: "10,000 د.ع"
};

// 📚 بيانات الملازم والمرشحات الذكية
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
    title: "ملزمة الاجتماعيات الوزارية (تعاليل وتعاريَف مختصرة)",
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
    desc: "أجهزة جسم الإنسان مشروحة بنقاط واضحة جداً مع أهم الرسومات الوزارية المكررة.",
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

// ✍️ أسئلة الاختبارات والذكاء
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

// عرض الواجهة الكاملة مع ربط الـ Manifest
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>🎓 منصة طلبتي التعليمية | المتجر الرسمي للملازم والمرشحات الذكية 2026</title>

  <!-- ربط ملف الـ Manifest وربط الـ PWA -->
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
          اختر أي ملزمة بـ <strong>10,000 د.ع فقط</strong>، وحول المبلغ عبر سوبر كي أو آسيا حوالة واستلم كود التفعيل الخاص بك لتفتح المادة فوراً!
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

    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>📚 ملازم ومرشحات طلبتي الحصرية (مختصرة ومضمونة)</span>
          </h3>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="books-grid"></div>
    </div>
  </main>

  <!-- Modal الدفع والتفعيل -->
  <div id="payment-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
    <div class="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-6">
      <div class="p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">💳</div>
          <div>
            <h3 class="text-base font-black" id="modal-book-title">تفعيل الملزمة</h3>
            <p class="text-xs text-amber-400 font-bold">المبلغ المطلوب: 10,000 د.ع فقط</p>
          </div>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer">✕</button>
      </div>

      <div class="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
        <button id="tab-btn-transfer" onclick="switchTab('transfer')" class="flex-1 py-2.5 px-3 rounded-xl text-xs font-black bg-indigo-600 text-white transition cursor-pointer">1. التحويل وسوبر كي 💳</button>
        <button id="tab-btn-code" onclick="switchTab('code')" class="flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-800 transition cursor-pointer">2. لدي كود تفعيل 🔑</button>
      </div>

      <div class="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
        <div id="transfer-tab-content" class="space-y-4">
          <div class="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-slate-300">بيانات التحويل المعتمدة (حول 10,000 د.ع):</span>
              <span class="text-[11px] text-emerald-400 font-bold">تفعيل فوري ✅</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span class="text-[11px] text-slate-400 block">سوبر كي / ماستر كارد الرافدين:</span>
                <span class="text-sm font-black font-mono text-amber-300">910160728184</span>
              </div>
              <button onclick="copyText('910160728184', 'ماستر كارد الرافدين')" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer">نسخ 📋</button>
            </div>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span class="text-[11px] text-slate-400 block">آسيا حوالة / زين كاش:</span>
                <span class="text-sm font-black font-mono text-rose-300">07734378998</span>
              </div>
              <button onclick="copyText('07734378998', 'آسيا حوالة')" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer">نسخ 📋</button>
            </div>
          </div>

          <form onsubmit="handleOrderSubmit(event)" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">اسم الطالب الثلاثي:</label>
              <input type="text" id="order-student-name" required placeholder="مثال: أحمد سامي حسن" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف / الواتساب:</label>
              <input type="tel" id="order-phone" required placeholder="07700000000" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500">
            </div>
            <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black text-xs shadow-xl cursor-pointer">إرسال إشعار التحويل لخدمة طلبتي 🚀</button>
          </form>
        </div>

        <div id="code-tab-content" class="space-y-4 hidden text-center py-2">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl border border-amber-500/30">🔑</div>
          <div>
            <h4 class="text-sm font-black text-white">إدخال كود التفعيل المباشر</h4>
          </div>
          <form onsubmit="handleCodeSubmit(event)" class="space-y-3 max-w-sm mx-auto">
            <input type="text" id="activation-code-input" required placeholder="مثال: TALABATI2026" class="w-full p-3.5 rounded-xl bg-slate-800 border-2 border-indigo-500/50 text-center font-mono font-black text-base text-indigo-300 uppercase focus:outline-none">
            <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg cursor-pointer">تأكيد الكود وفتح الملزمة فوراً 🔓</button>
          </form>
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-right">
            • <code class="text-indigo-400 font-bold">TALABATI2026</code> : تفعيل الملزمة المختارة.<br>
            • <code class="text-indigo-400 font-bold">VIP100</code> : تفعيل كافة ملازم طلبتي الـ 11.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal الاختبار -->
  <div id="quiz-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
    <div class="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-sm font-black text-white">🌟 اختبار طلبتي الذكي والسريع</h3>
        <button onclick="closeQuizModal()" class="p-1 text-slate-400 hover:text-white cursor-pointer">✕</button>
      </div>
      <div id="quiz-content" class="space-y-4"></div>
    </div>
  </div>

  <footer class="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-900">
    <p>منصة طلبتي التعليمية الذكية © 2026 • صنعت لطلاب العراق الأبطال 🇮🇶</p>
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
          <div class="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all shadow-xl">
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
              \${isUnlocked ? \`
                <button onclick="readBook('\${book.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg cursor-pointer">دراسة الملزمة 📖</button>
              \` : \`
                <button onclick="openPaymentModal('\${book.id}')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg cursor-pointer">فتح وتفعيل 🔓</button>
              \`}
            </div>
          </div>
        \`;
      }).join('');
    }

    function scrollToBooks() { document.getElementById('books-grid').scrollIntoView({ behavior: 'smooth' }); }
    function openPaymentModal(bookId) {
      selectedBook = BOOKS_DATA.find(b => b.id === bookId) || BOOKS_DATA[0];
      document.getElementById('modal-book-title').innerText = selectedBook.title;
      document.getElementById('payment-modal').classList.remove('hidden');
    }
    function openDirectCodeModal() { openPaymentModal('ar-grammar'); switchTab('code'); }
    function closeModal() { document.getElementById('payment-modal').classList.add('hidden'); }
    function switchTab(tab) {
      const isTransfer = tab === 'transfer';
      document.getElementById('transfer-tab-content').classList.toggle('hidden', !isTransfer);
      document.getElementById('code-tab-content').classList.toggle('hidden', isTransfer);
    }
    function copyText(txt, label) { navigator.clipboard.writeText(txt); alert('تم نسخ ' + label + ' بنجاح ✅'); }
    function openWhatsAppDirect() { window.open('https://wa.me/9647734378998?text=' + encodeURIComponent('مرحباً منصة طلبتي 🌟، أرغب بالاستفسار عن الملازم.'), '_blank'); }
    function handleOrderSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('order-student-name').value;
      const phone = document.getElementById('order-phone').value;
      const msg = 'مرحباً إدارة طلبتي 🌸\\nلقد قمت بتحويل 10,000 د.ع لملزمة:\\n* ' + selectedBook.title + '*\\nالاسم: ' + name + '\\nالهاتف: ' + phone;
      window.open('https://wa.me/9647734378998?text=' + encodeURIComponent(msg), '_blank');
      closeModal();
    }
    function handleCodeSubmit(e) {
      e.preventDefault();
      const code = document.getElementById('activation-code-input').value.trim().toUpperCase();
      if (['TALABATI2026', 'VIP100', 'TALABATI'].includes(code)) {
        if (code === 'VIP100') { unlockedBooks = ['ALL']; localStorage.setItem('unlocked_books', JSON.stringify(['ALL'])); }
        else { if (!unlockedBooks.includes(selectedBook.id)) { unlockedBooks.push(selectedBook.id); localStorage.setItem('unlocked_books', JSON.stringify(unlockedBooks)); } }
        try { confetti({ particleCount: 150, spread: 80 }); } catch(err) {}
        alert('🎉 مبروك يا بطل! تم تفعيل الملزمة بنجاح تام.');
        closeModal();
        renderBooks();
      } else { alert('❌ كود التفعيل غير صحيح!'); }
    }
    function readBook(bookId) { alert('📖 أهلاً بك في بيئة القراءة الذكية لملزمة طلبتي!'); }
    let currentQIdx = 0;
    function openQuizModal() {
      currentQIdx = Math.floor(Math.random() * QUESTIONS.length);
      const q = QUESTIONS[currentQIdx];
      document.getElementById('quiz-content').innerHTML = \`
        <div class="space-y-3">
          <span class="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold">\${q.subject}</span>
          <p class="text-sm font-bold text-white">\${q.q}</p>
          <div class="space-y-2">
            \${q.options.map((opt, idx) => \`<button onclick="checkAns(\${idx}, \${q.correct})" class="w-full text-right p-3 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-xs text-slate-200 cursor-pointer">\${opt}</button>\`).join('')}
          </div>
        </div>\`;
      document.getElementById('quiz-modal').classList.remove('hidden');
    }
    function checkAns(selected, correct) {
      if(selected === correct) { try{confetti({particleCount:100});}catch(e){} alert('🌟 إجابة صحيحة 100%!'); }
      else { alert('💡 خطأ بسيط، حاول مرة أخرى في السؤال القادم!'); }
      document.getElementById('quiz-modal').classList.add('hidden');
    }
    function closeQuizModal() { document.getElementById('quiz-modal').classList.add('hidden'); }
    renderBooks();
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
