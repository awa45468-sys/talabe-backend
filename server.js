
The following action was requested:
Create file /server.jsThe action produced the following result:
Successfully created file /server.js with content:
// ==============================================================================================
// 🎓 منصة طلبتي التعليمية - المتجر الرسمي للملازم الوزارية 2026
// سكربت كامل شامل متكامل في ملف واحد (Single File Full App for Node.js / Vercel / GitHub)
// يحتوي على: 11 ملزمة + سوبر كي + ماستر كارد + آسيا حوالة + زين كاش + واتساب مباشر + أكواد التفعيل + الاختبارات
// ==============================================================================================
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// 💳 إعدادات الدفع الرسمية
const PAYMENT_CONFIG = {
rafidainCard: "910160728184",
asiaHawala: "07734378998",
zainCash: "07734378998",
supportPhone: "9647734378998",
price: "10,000 د.ع"
};
// 📚 بيانات الملازم الـ 11 بالكامل
const BOOKS_DATABASE = [
{
id: "ar-grammar",
title: "ملزمة قواعد اللغة العربية الشاملة",
subject: "لغة عربية",
teacher: "الأستاذ حمزة الجابري",
pages: 180,
price: "10,000 د.ع",
desc: "شرح مبسط لقواعد الثالث المتوسط مع إعراب الأمثلة والتمارين والأسئلة الوزارية لضمان الـ 100.",
badge: "الأعلى طلباً ⭐",
color: "from-amber-500 to-orange-600"
},
{
id: "ar-lit",
title: "ملزمة الأدب والنصوص والإنشاء",
subject: "لغة عربية",
teacher: "الأستاذ حمزة الجابري",
pages: 140,
price: "10,000 د.ع",
desc: "تحليل قصائد الشعراء المطلوبة وزارياً وطرق كتابة الإنشاء الكامل لضمان 20 درجة.",
badge: "محدثة 2026",
color: "from-rose-500 to-red-600"
},
{
id: "en-gold",
title: "ملزمة اللغة الإنكليزية الذهبية",
subject: "إنكليزي",
teacher: "الأستاذ محمد العبيدي",
pages: 175,
price: "10,000 د.ع",
desc: "شرح قواعد المنهج، القطع الاستيعابية، والإنشاءات الوزارية المترجمة والمعتمدة.",
badge: "شاملة القواعد",
color: "from-blue-500 to-indigo-600"
},
{
id: "math-p1",
title: "مرشحات الرياضيات - الجزء الأول",
subject: "رياضيات",
teacher: "الأستاذ حيدر وليد",
pages: 165,
price: "10,000 د.ع",
desc: "حلول نموذجية وشرح مبسط لجميع الأسئلة والتمارين الوزارية المكررة للفصول 1 و 2 و 3.",
badge: "مرشحات مؤكدة 🔥",
color: "from-purple-500 to-indigo-700"
},
{
id: "math-p2",
title: "مرشحات الرياضيات - الجزء الثاني",
subject: "رياضيات",
teacher: "الأستاذ حيدر وليد",
pages: 150,
price: "10,000 د.ع",
desc: "تغطية كاملة لفصول الهندسة والإحصاء والمجسمات مع الأسئلة المتوقعة بنسبة 100%.",
badge: "الجزء الثاني",
color: "from-cyan-500 to-blue-600"
},
{
id: "soc-com",
title: "الملزمة الشاملة للاجتماعيات الوزارية",
subject: "اجتماعيات",
teacher: "الأستاذ قصي الربيعي",
pages: 190,
price: "10,000 د.ع",
desc: "تتضمن التاريخ، الجغرافيا، والوطنية مع حلول جميع التعاليل والخرائط والتعاريف الوزارية.",
badge: "شامل 3 مواد",
color: "from-emerald-500 to-teal-700"
},
{
id: "chem-com",
title: "ملزمة الكيمياء الوزارية الشاملة",
subject: "كيمياء",
teacher: "الأستاذ مهند السوداني",
pages: 155,
price: "10,000 د.ع",
desc: "الترتيب الإلكتروني، المعادلات الكيميائية، والكشوفات والتحضيرات المطلوبة في الامتحان الوزاري.",
badge: "كشوفات ومعادلات",
color: "from-teal-500 to-emerald-600"
},
{
id: "phys-law",
title: "ملزمة قوانين ومسائل الفيزياء",
subject: "فيزياء",
teacher: "الأستاذ مؤيد سليم",
pages: 160,
price: "10,000 د.ع",
desc: "شرح القوانين الرياضية، ربط المقاومات، والمشاريع مع المسائل الوزارية المكررة.",
badge: "مسائل وقوانين",
color: "from-sky-500 to-indigo-600"
},
{
id: "bio-diag",
title: "ملزمة الأحياء والرسومات الوزارية",
subject: "أحياء",
teacher: "الأستاذ ماهر نايف",
pages: 145,
price: "10,000 د.ع",
desc: "ملخص أجهزة جسم الإنسان مع كافة الرسومات والمخططات المطلوبة في الوزاري.",
badge: "رسومات واضحة",
color: "from-green-500 to-emerald-700"
},
{
id: "islamic-rules",
title: "ملزمة التربية الإسلامية والأحكام",
subject: "إسلامية",
teacher: "الأستاذ أحمد النعيمي",
pages: 120,
price: "10,000 د.ع",
desc: "شرح أحكام التلاوة، تفسير السور الكريمة، والأحاديث النبوية الشريفة المقررة.",
badge: "درجة كاملة",
color: "from-amber-600 to-yellow-600"
},
{
id: "all-in-one",
title: "بنك الوزاريات الشامل (جميع المواد)",
subject: "شامل",
teacher: "نخبة الأساتذة الأوائل",
pages: 320,
price: "10,000 د.ع",
desc: "تجميع لكافة أسئلة الامتحانات الوزارية للسنوات السابقة مع أجوبتها النموذجية المعتمدة.",
badge: "VIP شامل ⭐",
color: "from-indigo-600 via-purple-600 to-pink-600"
}
];
// ✍️ أسئلة الامتحانات السريعة
const QUIZ_QUESTIONS = [
{
subject: "لغة عربية",
q: "ما هو إعراب (ما) في جملة: (ما نجحَ الكسولُ)؟",
options: ["نافية غير عاملة لا محل لها من الإعراب", "اسم استفهام في محل رفع مبتدأ", "اسم موصول بمعنى الذي", "حرف جر زائد"],
correct: 0,
exp: "(ما) هنا نافية دخلت على الفعل الماضي فتكون نافية غير عاملة."
},
{
subject: "رياضيات",
q: "ما هو ناتج تحليل المقدار: (x² - 9) بالفرق بين مربعين؟",
options: ["(x - 3)(x + 3)", "(x - 9)(x + 1)", "(x - 3)²", "(x + 3)²"],
correct: 0,
exp: "الفرق بين مربعين: جذر الأول ناقص جذر الثاني في جذر الأول زائد جذر الثاني."
},
{
subject: "كيمياء",
q: "ما هو العنصر الأكثر كهروسلبية في الجدول الدوري؟",
options: ["الفلور (F)", "الصوديوم (Na)", "الكلور (Cl)", "الأكسجين (O)"],
correct: 0,
exp: "عنصر الفلور هو أعلى العناصر كهروسلبية في الجدول الدوري بقيمة 4.0."
},
{
subject: "فيزياء",
q: "يقاس التيار الكهربائي في الدائرة الكهربائية بواسطة جهاز:",
options: ["الأميتر (Ammeter)", "الفولتميتر (Voltmeter)", "الأوميتر (Ohmmeter)", "الباروميتر"],
correct: 0,
exp: "يربط جهاز الأميتر على التوالي في الدائرة لقياس مقدار التيار الكهربائي."
}
];
// عرض الواجهة الكاملة
app.get('*', (req, res) => {
res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>🎓 منصة طلبتي التعليمية | المتجر الرسمي للملازم الوزارية 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
<style>
body { font-family: 'Tajawal', 'Cairo', sans-serif; }
.glass-card { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
.badge-glow { box-shadow: 0 0 15px rgba(245, 158, 11, 0.35); }
</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-600 selection:text-white pb-20">
<header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
<div class="max-w-6xl mx-auto flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">
🎓
</div>
<div>
<h1 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
منصة طلبتي التعليمية
<span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">2026</span>
</h1>
<p class="text-[11px] text-slate-400">المتجر المعتمد لملازم الثالث المتوسط في العراق 🇮🇶</p>
</div>
</div>
code
Code
<div class="flex items-center gap-2">
    <button onclick="openQuizModal()" class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5 cursor-pointer">
      <span>✍️ امتحن نفسي</span>
    </button>
    <button onclick="openWhatsAppDirect()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-600/30">
      <span>💬 تواصل واتساب</span>
    </button>
  </div>
</div>
</header>
<div class="bg-gradient-to-r from-amber-600/20 via-indigo-600/20 to-purple-600/20 border-b border-indigo-500/20 py-2 px-4 text-center">
<div class="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
<span class="text-amber-400 flex items-center gap-1">⏳ موعد الامتحانات الوزارية:</span>
<span class="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs border border-slate-700">1 يونيو 2026</span>
<span class="text-slate-400">|</span>
<span class="text-emerald-400">🔥 جميع الملازم محدثة وفق الحذوفات والتقليصات الوزارية 100%</span>
</div>
</div>
<main class="max-w-6xl mx-auto px-4 py-6 space-y-8">
<div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6">
<div class="space-y-3 max-w-xl">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black">
<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
<span>تفعيل فوري عبر سوبر كي / ماستر كارد وآسيا حوالة</span>
</div>
<h2 class="text-2xl sm:text-3xl font-black text-white leading-tight">
حقّق معدل الـ <span class="text-amber-400 underline decoration-amber-500">100% في الوزاري</span> مع نخبة أساتذة العراق 🇮🇶
</h2>
<p class="text-xs sm:text-sm text-slate-300">
اختر ملزمتك بـ <strong>10,000 د.ع فقط</strong>، وحول المبلغ عبر سوبر كي أو آسيا حوالة واستلم كود التفعيل لفتح المادة مباشرة!
</p>
</div>
code
Code
<div class="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
    <button onclick="scrollToBooks()" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
      <span>📚 تصفح الملازم الـ 11</span>
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
        <span>📚 الملازم والمرشحات المتوفرة (11 ملزمة)</span>
      </h3>
      <p class="text-xs text-slate-400">انقر على أي ملزمة لفتحها وتفعيلها أو إدخال كود التفعيل</p>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="books-grid"></div>
</div>
</main>
<div id="payment-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
<div class="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95">
code
Code
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
          <span>تأكيد الطلب وإرسال الوصل للواتساب 🚀</span>
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
        <p class="text-xs text-slate-400 mt-1">أدخل الكود الذي استلمته من المشرف عبر الواتساب لفتح المادة فوراً</p>
      </div>

      <form onsubmit="handleCodeSubmit(event)" class="space-y-3 max-w-sm mx-auto">
        <input type="text" id="activation-code-input" required placeholder="مثال: IQ2026 أو TALABATI2026" class="w-full p-3.5 rounded-xl bg-slate-800 border-2 border-indigo-500/50 text-center font-mono font-black text-base tracking-widest text-indigo-300 uppercase focus:outline-none">
        
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg cursor-pointer transition">
          <span>تأكيد الكود وفتح الملزمة فوراً 🔓</span>
        </button>
      </form>

      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-right">
        <strong class="text-amber-400 block mb-1">💡 أكواد التفعيل المعتمدة:</strong>
        • <code class="text-indigo-400 font-bold">IQ2026</code> : فتح المادة المختارة.<br>
        • <code class="text-indigo-400 font-bold">TALABATI2026</code> : كود VIP لفتح كافة الملازم الـ 11.
      </div>
    </div>

  </div>
</div>
</div>
<div id="quiz-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
<div class="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-5 space-y-4">
<div class="flex items-center justify-between border-b border-slate-800 pb-3">
<div class="flex items-center gap-2">
<span class="text-xl">✍️</span>
<h3 class="text-sm font-black text-white">اختبار وزاري سريع</h3>
</div>
<button onclick="closeQuizModal()" class="p-1 text-slate-400 hover:text-white cursor-pointer">✕</button>
</div>
code
Code
<div id="quiz-content" class="space-y-4"></div>
</div>
</div>
<footer class="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-900">
<p>منصة طلبتي التعليمية © 2026 • معتمدة لطلاب الثالث المتوسط في العراق 🇮🇶</p>
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
<div class="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all hover:scale-[1.01] shadow-xl">
<div class="space-y-2.5">
<div class="flex items-center justify-between gap-2">
<span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
\${book.subject} • \${book.pages} صفحة
</span>
<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
\${book.badge}
</span>
</div>
<h4 class="text-base font-black text-white leading-snug">\${book.title}</h4>
<p class="text-xs text-amber-400 font-bold">👨‍🏫 \${book.teacher}</p>
<p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">\${book.desc}</p>
</div>

<div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
<span class="text-sm font-black font-mono text-emerald-400">\${book.price}</span>
\${isUnlocked ? \`
<button onclick="readBook('\${book.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5">
<span>قراءة الملزمة 📖</span>
</button>
\` : \`
<button onclick="openPaymentModal('\${book.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5">
<span>فتح وتفعيل الملزمة 🔓</span>
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

function openWhatsAppDirect(customMsg) {
const msg = customMsg || 'السلام عليكم أستاذ، أرغب بالاستفسار عن ملازم الصف الثالث المتوسط 2026.';
window.open('https://wa.me/9647734378998?text=' + encodeURIComponent(msg), '_blank');
}

function handleOrderSubmit(e) {
e.preventDefault();
const name = document.getElementById('order-student-name').value;
const phone = document.getElementById('order-phone').value;
const method = document.getElementById('order-method').value;

const waMsg = 'السلام عليكم أستاذ 🌹\\nلقد قمت بتحويل مبلغ 10,000 د.ع لتفعيل ملزمة:\\n📚 *' + selectedBook.title + '*\\n\\n👤 اسم الطالب: ' + name + '\\n📱 رقم الهاتف: ' + phone + '\\n💳 طريقة التحويل: ' + method + '\\n\\nيرجى تزويدي بكود التفعيل لفتح المادة وشكراً جزيلاً!';

alert('تم تسجيل طلبك بنجاح! يتم الآن توجيهك للواتساب لإرسال الوصل.');
window.open('https://wa.me/9647734378998?text=' + encodeURIComponent(waMsg), '_blank');
closeModal();
}

function handleCodeSubmit(e) {
e.preventDefault();
const code = document.getElementById('activation-code-input').value.trim().toUpperCase();
const valid = ['IQ2026', 'TALABATI2026', 'VIP999', 'QI2026', 'SUPERQI', 'BAGHDAD2026'];

if (valid.includes(code)) {
if (code === 'TALABATI2026' || code === 'VIP999') {
unlockedBooks = ['ALL'];
localStorage.setItem('unlocked_books', JSON.stringify(['ALL']));
} else {
if (!unlockedBooks.includes(selectedBook.id)) {
unlockedBooks.push(selectedBook.id);
localStorage.setItem('unlocked_books', JSON.stringify(unlockedBooks));
}
}

try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch(err) {}
alert('🎉 كود التفعيل صحيح 100%! تم فتح الملزمة كاملة بنجاح.');
closeModal();
renderBooks();
} else {
alert('❌ كود التفعيل غير صحيح! تواصل مع المشرف عبر الواتساب للحصول على كود صالح.');
}
}

function readBook(bookId) {
alert('📖 تم فتح الملزمة بنجاح! جاهزة للدراسة والتحميل طوال العام الدراسي.');
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
<button onclick="checkQuizAnswer(\${idx})" class="w-full text-right p-3 rounded-xl bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500 text-xs font-medium text-slate-200 transition cursor-pointer">
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
try { confetti({ particleCount: 70, spread: 60 }); } catch(e){}
alert('إجابة صحيحة 100%! أحسنت 🌟\\n' + q.exp);
} else {
alert('إجابة خاطئة! الإجابة الصحيحة هي: ' + q.options[q.correct] + '\\n' + q.exp);
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
console.log(Server is running on http://localhost:${PORT});
});
The action produced the following result:
Successfully created file /server.js with content:
// ==============================================================================================
// 🎓 منصة طلبتي التعليمية - المتجر الرسمي للملازم الوزارية 2026
// سكربت كامل شامل متكامل في ملف واحد (Single File Full App for Node.js / Vercel / GitHub)
// يحتوي على: 11 ملزمة + سوبر كي + ماستر كارد + آسيا حوالة + زين كاش + واتساب مباشر + أكواد التفعيل + الاختبارات
// ==============================================================================================
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// 💳 إعدادات الدفع الرسمية
const PAYMENT_CONFIG = {
rafidainCard: "910160728184",
asiaHawala: "07734378998",
zainCash: "07734378998",
supportPhone: "9647734378998",
price: "10,000 د.ع"
};
// 📚 بيانات الملازم الـ 11 بالكامل
const BOOKS_DATABASE = [
{
id: "ar-grammar",
title: "ملزمة قواعد اللغة العربية الشاملة",
subject: "لغة عربية",
teacher: "الأستاذ حمزة الجابري",
pages: 180,
price: "10,000 د.ع",
desc: "شرح مبسط لقواعد الثالث المتوسط مع إعراب الأمثلة والتمارين والأسئلة الوزارية لضمان الـ 100.",
badge: "الأعلى طلباً ⭐",
color: "from-amber-500 to-orange-600"
},
{
id: "ar-lit",
title: "ملزمة الأدب والنصوص والإنشاء",
subject: "لغة عربية",
teacher: "الأستاذ حمزة الجابري",
pages: 140,
price: "10,000 د.ع",
desc: "تحليل قصائد الشعراء المطلوبة وزارياً وطرق كتابة الإنشاء الكامل لضمان 20 درجة.",
badge: "محدثة 2026",
color: "from-rose-500 to-red-600"
},
{
id: "en-gold",
title: "ملزمة اللغة الإنكليزية الذهبية",
subject: "إنكليزي",
teacher: "الأستاذ محمد العبيدي",
pages: 175,
price: "10,000 د.ع",
desc: "شرح قواعد المنهج، القطع الاستيعابية، والإنشاءات الوزارية المترجمة والمعتمدة.",
badge: "شاملة القواعد",
color: "from-blue-500 to-indigo-600"
},
{
id: "math-p1",
title: "مرشحات الرياضيات - الجزء الأول",
subject: "رياضيات",
teacher: "الأستاذ حيدر وليد",
pages: 165,
price: "10,000 د.ع",
desc: "حلول نموذجية وشرح مبسط لجميع الأسئلة والتمارين الوزارية المكررة للفصول 1 و 2 و 3.",
badge: "مرشحات مؤكدة 🔥",
color: "from-purple-500 to-indigo-700"
},
{
id: "math-p2",
title: "مرشحات الرياضيات - الجزء الثاني",
subject: "رياضيات",
teacher: "الأستاذ حيدر وليد",
pages: 150,
price: "10,000 د.ع",
desc: "تغطية كاملة لفصول الهندسة والإحصاء والمجسمات مع الأسئلة المتوقعة بنسبة 100%.",
badge: "الجزء الثاني",
color: "from-cyan-500 to-blue-600"
},
{
id: "soc-com",
title: "الملزمة الشاملة للاجتماعيات الوزارية",
subject: "اجتماعيات",
teacher: "الأستاذ قصي الربيعي",
pages: 190,
price: "10,000 د.ع",
desc: "تتضمن التاريخ، الجغرافيا، والوطنية مع حلول جميع التعاليل والخرائط والتعاريف الوزارية.",
badge: "شامل 3 مواد",
color: "from-emerald-500 to-teal-700"
},
{
id: "chem-com",
title: "ملزمة الكيمياء الوزارية الشاملة",
subject: "كيمياء",
teacher: "الأستاذ مهند السوداني",
pages: 155,
price: "10,000 د.ع",
desc: "الترتيب الإلكتروني، المعادلات الكيميائية، والكشوفات والتحضيرات المطلوبة في الامتحان الوزاري.",
badge: "كشوفات ومعادلات",
color: "from-teal-500 to-emerald-600"
},
{
id: "phys-law",
title: "ملزمة قوانين ومسائل الفيزياء",
subject: "فيزياء",
teacher: "الأستاذ مؤيد سليم",
pages: 160,
price: "10,000 د.ع",
desc: "شرح القوانين الرياضية، ربط المقاومات، والمشاريع مع المسائل الوزارية المكررة.",
badge: "مسائل وقوانين",
color: "from-sky-500 to-indigo-600"
},
{
id: "bio-diag",
title: "ملزمة الأحياء والرسومات الوزارية",
subject: "أحياء",
teacher: "الأستاذ ماهر نايف",
pages: 145,
price: "10,000 د.ع",
desc: "ملخص أجهزة جسم الإنسان مع كافة الرسومات والمخططات المطلوبة في الوزاري.",
badge: "رسومات واضحة",
color: "from-green-500 to-emerald-700"
},
{
id: "islamic-rules",
title: "ملزمة التربية الإسلامية والأحكام",
subject: "إسلامية",
teacher: "الأستاذ أحمد النعيمي",
pages: 120,
price: "10,000 د.ع",
desc: "شرح أحكام التلاوة، تفسير السور الكريمة، والأحاديث النبوية الشريفة المقررة.",
badge: "درجة كاملة",
color: "from-amber-600 to-yellow-600"
},
{
id: "all-in-one",
title: "بنك الوزاريات الشامل (جميع المواد)",
subject: "شامل",
teacher: "نخبة الأساتذة الأوائل",
pages: 320,
price: "10,000 د.ع",
desc: "تجميع لكافة أسئلة الامتحانات الوزارية للسنوات السابقة مع أجوبتها النموذجية المعتمدة.",
badge: "VIP شامل ⭐",
color: "from-indigo-600 via-purple-600 to-pink-600"
}
];
// ✍️ أسئلة الامتحانات السريعة
const QUIZ_QUESTIONS = [
{
subject: "لغة عربية",
q: "ما هو إعراب (ما) في جملة: (ما نجحَ الكسولُ)؟",
options: ["نافية غير عاملة لا محل لها من الإعراب", "اسم استفهام في محل رفع مبتدأ", "اسم موصول بمعنى الذي", "حرف جر زائد"],
correct: 0,
exp: "(ما) هنا نافية دخلت على الفعل الماضي فتكون نافية غير عاملة."
},
{
subject: "رياضيات",
q: "ما هو ناتج تحليل المقدار: (x² - 9) بالفرق بين مربعين؟",
options: ["(x - 3)(x + 3)", "(x - 9)(x + 1)", "(x - 3)²", "(x + 3)²"],
correct: 0,
exp: "الفرق بين مربعين: جذر الأول ناقص جذر الثاني في جذر الأول زائد جذر الثاني."
},
{
subject: "كيمياء",
q: "ما هو العنصر الأكثر كهروسلبية في الجدول الدوري؟",
options: ["الفلور (F)", "الصوديوم (Na)", "الكلور (Cl)", "الأكسجين (O)"],
correct: 0,
exp: "عنصر الفلور هو أعلى العناصر كهروسلبية في الجدول الدوري بقيمة 4.0."
},
{
subject: "فيزياء",
q: "يقاس التيار الكهربائي في الدائرة الكهربائية بواسطة جهاز:",
options: ["الأميتر (Ammeter)", "الفولتميتر (Voltmeter)", "الأوميتر (Ohmmeter)", "الباروميتر"],
correct: 0,
exp: "يربط جهاز الأميتر على التوالي في الدائرة لقياس مقدار التيار الكهربائي."
}
];
// عرض الواجهة الكاملة
app.get('*', (req, res) => {
res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>🎓 منصة طلبتي التعليمية | المتجر الرسمي للملازم الوزارية 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
<style>
body { font-family: 'Tajawal', 'Cairo', sans-serif; }
.glass-card { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
.badge-glow { box-shadow: 0 0 15px rgba(245, 158, 11, 0.35); }
</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-600 selection:text-white pb-20">
<header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
<div class="max-w-6xl mx-auto flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">
🎓
</div>
<div>
<h1 class="text-base sm:text-lg font-black text-white flex items-center gap-2">
منصة طلبتي التعليمية
<span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">2026</span>
</h1>
<p class="text-[11px] text-slate-400">المتجر المعتمد لملازم الثالث المتوسط في العراق 🇮🇶</p>
</div>
</div>
code
Code
<div class="flex items-center gap-2">
    <button onclick="openQuizModal()" class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5 cursor-pointer">
      <span>✍️ امتحن نفسي</span>
    </button>
    <button onclick="openWhatsAppDirect()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-600/30">
      <span>💬 تواصل واتساب</span>
    </button>
  </div>
</div>
</header>
<div class="bg-gradient-to-r from-amber-600/20 via-indigo-600/20 to-purple-600/20 border-b border-indigo-500/20 py-2 px-4 text-center">
<div class="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
<span class="text-amber-400 flex items-center gap-1">⏳ موعد الامتحانات الوزارية:</span>
<span class="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs border border-slate-700">1 يونيو 2026</span>
<span class="text-slate-400">|</span>
<span class="text-emerald-400">🔥 جميع الملازم محدثة وفق الحذوفات والتقليصات الوزارية 100%</span>
</div>
</div>
<main class="max-w-6xl mx-auto px-4 py-6 space-y-8">
<div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6">
<div class="space-y-3 max-w-xl">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black">
<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
<span>تفعيل فوري عبر سوبر كي / ماستر كارد وآسيا حوالة</span>
</div>
<h2 class="text-2xl sm:text-3xl font-black text-white leading-tight">
حقّق معدل الـ <span class="text-amber-400 underline decoration-amber-500">100% في الوزاري</span> مع نخبة أساتذة العراق 🇮🇶
</h2>
<p class="text-xs sm:text-sm text-slate-300">
اختر ملزمتك بـ <strong>10,000 د.ع فقط</strong>، وحول المبلغ عبر سوبر كي أو آسيا حوالة واستلم كود التفعيل لفتح المادة مباشرة!
</p>
</div>
code
Code
<div class="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
    <button onclick="scrollToBooks()" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
      <span>📚 تصفح الملازم الـ 11</span>
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
        <span>📚 الملازم والمرشحات المتوفرة (11 ملزمة)</span>
      </h3>
      <p class="text-xs text-slate-400">انقر على أي ملزمة لفتحها وتفعيلها أو إدخال كود التفعيل</p>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="books-grid"></div>
</div>
</main>
<div id="payment-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
<div class="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95">
code
Code
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
          <span>تأكيد الطلب وإرسال الوصل للواتساب 🚀</span>
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
        <p class="text-xs text-slate-400 mt-1">أدخل الكود الذي استلمته من المشرف عبر الواتساب لفتح المادة فوراً</p>
      </div>

      <form onsubmit="handleCodeSubmit(event)" class="space-y-3 max-w-sm mx-auto">
        <input type="text" id="activation-code-input" required placeholder="مثال: IQ2026 أو TALABATI2026" class="w-full p-3.5 rounded-xl bg-slate-800 border-2 border-indigo-500/50 text-center font-mono font-black text-base tracking-widest text-indigo-300 uppercase focus:outline-none">
        
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg cursor-pointer transition">
          <span>تأكيد الكود وفتح الملزمة فوراً 🔓</span>
        </button>
      </form>

      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-right">
        <strong class="text-amber-400 block mb-1">💡 أكواد التفعيل المعتمدة:</strong>
        • <code class="text-indigo-400 font-bold">IQ2026</code> : فتح المادة المختارة.<br>
        • <code class="text-indigo-400 font-bold">TALABATI2026</code> : كود VIP لفتح كافة الملازم الـ 11.
      </div>
    </div>

  </div>
</div>
</div>
<div id="quiz-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md hidden overflow-y-auto">
<div class="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-5 space-y-4">
<div class="flex items-center justify-between border-b border-slate-800 pb-3">
<div class="flex items-center gap-2">
<span class="text-xl">✍️</span>
<h3 class="text-sm font-black text-white">اختبار وزاري سريع</h3>
</div>
<button onclick="closeQuizModal()" class="p-1 text-slate-400 hover:text-white cursor-pointer">✕</button>
</div>
code
Code
<div id="quiz-content" class="space-y-4"></div>
</div>
</div>
<footer class="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-900">
<p>منصة طلبتي التعليمية © 2026 • معتمدة لطلاب الثالث المتوسط في العراق 🇮🇶</p>
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
<div class="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all hover:scale-[1.01] shadow-xl">
<div class="space-y-2.5">
<div class="flex items-center justify-between gap-2">
<span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
\${book.subject} • \${book.pages} صفحة
</span>
<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
\${book.badge}
</span>
</div>
<h4 class="text-base font-black text-white leading-snug">\${book.title}</h4>
<p class="text-xs text-amber-400 font-bold">👨‍🏫 \${book.teacher}</p>
<p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">\${book.desc}</p>
</div>

<div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
<span class="text-sm font-black font-mono text-emerald-400">\${book.price}</span>
\${isUnlocked ? \`
<button onclick="readBook('\${book.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5">
<span>قراءة الملزمة 📖</span>
</button>
\` : \`
<button onclick="openPaymentModal('\${book.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5">
<span>فتح وتفعيل الملزمة 🔓</span>
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

function openWhatsAppDirect(customMsg) {
const msg = customMsg || 'السلام عليكم أستاذ، أرغب بالاستفسار عن ملازم الصف الثالث المتوسط 2026.';
window.open('https://wa.me/9647734378998?text=' + encodeURIComponent(msg), '_blank');
}

function handleOrderSubmit(e) {
e.preventDefault();
const name = document.getElementById('order-student-name').value;
const phone = document.getElementById('order-phone').value;
const method = document.getElementById('order-method').value;

const waMsg = 'السلام عليكم أستاذ 🌹\\nلقد قمت بتحويل مبلغ 10,000 د.ع لتفعيل ملزمة:\\n📚 *' + selectedBook.title + '*\\n\\n👤 اسم الطالب: ' + name + '\\n📱 رقم الهاتف: ' + phone + '\\n💳 طريقة التحويل: ' + method + '\\n\\nيرجى تزويدي بكود التفعيل لفتح المادة وشكراً جزيلاً!';

alert('تم تسجيل طلبك بنجاح! يتم الآن توجيهك للواتساب لإرسال الوصل.');
window.open('https://wa.me/9647734378998?text=' + encodeURIComponent(waMsg), '_blank');
closeModal();
}

function handleCodeSubmit(e) {
e.preventDefault();
const code = document.getElementById('activation-code-input').value.trim().toUpperCase();
const valid = ['IQ2026', 'TALABATI2026', 'VIP999', 'QI2026', 'SUPERQI', 'BAGHDAD2026'];

if (valid.includes(code)) {
if (code === 'TALABATI2026' || code === 'VIP999') {
unlockedBooks = ['ALL'];
localStorage.setItem('unlocked_books', JSON.stringify(['ALL']));
} else {
if (!unlockedBooks.includes(selectedBook.id)) {
unlockedBooks.push(selectedBook.id);
localStorage.setItem('unlocked_books', JSON.stringify(unlockedBooks));
}
}

try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch(err) {}
alert('🎉 كود التفعيل صحيح 100%! تم فتح الملزمة كاملة بنجاح.');
closeModal();
renderBooks();
} else {
alert('❌ كود التفعيل غير صحيح! تواصل مع المشرف عبر الواتساب للحصول على كود صالح.');
}
}

function readBook(bookId) {
alert('📖 تم فتح الملزمة بنجاح! جاهزة للدراسة والتحميل طوال العام الدراسي.');
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
<button onclick="checkQuizAnswer(\${idx})" class="w-full text-right p-3 rounded-xl bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500 text-xs font-medium text-slate-200 transition cursor-pointer">
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
try { confetti({ particleCount: 70, spread: 60 }); } catch(e){}
alert('إجابة صحيحة 100%! أحسنت 🌟\\n' + q.exp);
} else {
alert('إجابة خاطئة! الإجابة الصحيحة هي: ' + q.options[q.correct] + '\\n' + q.exp);
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
console.log(Server is running on http://localhost:${PORT});
});
The following action was requested:
Building applet...The action produced the following result:
Build succeeded - the applet is compiled
lightbulb_tips
