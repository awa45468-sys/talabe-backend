const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ======================================================
// 1. قاعدة البيانات المؤقتة (In-Memory Database)
// ======================================================

const GOVERNORATES = [
  "بغداد", "نينوى", "البصرة", "أربيل", "كربلاء", "النجف", "الأنبار", "صلاح الدين",
  "ديالى", "واسط", "ميسان", "ذي قار", "المثنى", "القادسية", "بابل", "كركوك", "دهوك", "السليمانية"
];

let users = [
  { id: 1, phone: "07700000000", password: "123", full_name: "مدير النظام", role: "admin" }
];

let subjects = [
  { 
    id: 104, 
    tag: "اجتماعيات", 
    price: "10,000 د.ع", 
    title: "الملزمة الشاملة للاجتماعيات الوزارية", 
    desc: "تتضمن التاريخ، الجغرافيا، والوطنية مع حلول جميع التعاليل والخرائط والتعاريف." 
  },
  { 
    id: 105, 
    tag: "رياضيات", 
    price: "10,000 د.ع", 
    title: "مرشحات الرياضيات - الجزء الأول", 
    desc: "شرح الأسئلة الوزارية المكررة وتملص أهم القوانين والتمارين المرشحة." 
  },
  { 
    id: 101, 
    tag: "كيمياء", 
    price: "10,000 د.ع", 
    title: "حقيبة الكيمياء للوزاري", 
    desc: "ملخص القوانين والتجربة والحلول النموذجية المعتمدة لمركز الفحص." 
  }
];

let subscriptions = [];

// ======================================================
// 2. الواجهة الرئيسية (Frontend - HTML/CSS)
// ======================================================

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>منصة تفوق التعليمية</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Tajawal', sans-serif; background-color: #f8fafc; }
  </style>
</head>
<body class="pb-12">

  <!-- الهيدر الرئيسي -->
  <header class="bg-gradient-to-b from-[#1e1b4b] via-[#2e1065] to-[#3b82f6] text-white pt-10 pb-16 px-6 text-center rounded-b-[2.5rem] shadow-xl relative">
    <div class="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-4">
      <svg class="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H5V4h14v16z"/>
      </svg>
    </div>
    <h1 class="text-3xl font-extrabold mb-2">منصة تفوق التعليمية</h1>
    <p class="text-slate-200 text-sm max-w-md mx-auto font-medium leading-relaxed">
      المتجر الرسمي للملازم والمرشحات الوزارية — فتح أي كتاب بـ 10,000 دينار فقط
    </p>
  </header>

  <!-- قائمة الكتب والملازم -->
  <main class="max-w-md mx-auto px-4 -mt-8 space-y-5">
    ${subjects.map(sub => `
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition transform active:scale-[0.99]">
        
        <!-- البادجات العلوية -->
        <div class="flex items-center justify-between mb-3">
          <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            🏷️ ${sub.price}
          </span>
          <span class="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full">
            ${sub.tag}
          </span>
        </div>

        <!-- معلومات الكتاب -->
        <h2 class="text-lg font-bold text-slate-800 mb-2">${sub.title}</h2>
        <p class="text-xs text-slate-500 leading-relaxed mb-5">${sub.desc}</p>

        <!-- زر الشراء -->
        <button onclick="buySubject('${sub.id}', '${sub.title}')" class="w-full bg-[#312e81] hover:bg-[#1e1b4b] text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition">
          <span>دفع ${sub.price} لفتح الكتاب</span>
          <span>🔒</span>
        </button>

      </div>
    `).join('')}
  </main>

  <script>
    function buySubject(id, title) {
      alert("طلب فتح (" + title + ")\\n\\nيرجى التواصل مع الدعم أو تحويل المبلغ لتفعيل الاشتراك مباشرة.");
    }
  </script>

</body>
</html>
  `);
});

// ======================================================
// 3. مسارات APIs الـ Backend
// ======================================================

app.get('/api/subjects', (req, res) => res.json({ success: true, subjects }));

app.post('/api/subscriptions/pay', (req, res) => {
  const { user_id, subject_id, method } = req.body;
  const newSub = {
    id: subscriptions.length + 1,
    user_id: parseInt(user_id) || 1,
    subject_id: parseInt(subject_id),
    status: "approved",
    date: new Date().toISOString().split('T')[0]
  };
  subscriptions.push(newSub);
  res.json({ success: true, message: "تم تفعيل الاشتراك بنجاح!", subscription: newSub });
});

module.exports = app;
