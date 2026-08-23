const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================= ====================================
// 1. قاعدة البيانات المؤقتة الشاملة (In-Memory Database)
// ======================================================

const GOVERNORATES = [
  "بغداد", "نينوى", "البصرة", "أربيل", "كربلاء", "النجف", "الأنبار", "صلاح الدين",
  "ديالى", "واسط", "ميسان", "ذي قار", "المثنى", "القادسية", "بابل", "كركوك", "دهوك", "السليمانية"
];

let users = [
  { id: 1, phone: "07700000000", password: "123", full_name: "مدير النظام", gender: "ذكر", governorate: "بغداد", role: "admin", points: 100 }
];

let stages = [
  { id: 1, name: "السادس الإعدادي", branch: "علمي / أحيائي" },
  { id: 2, name: "السادس الإعدادي", branch: "تطبيقي" },
  { id: 3, name: "السادس الإعدادي", branch: "أدبي" },
  { id: 4, name: "السادس الإعدادي", branch: "مهني (صناعي/تجاري/زراعي)" },
  { id: 5, name: "الثالث المتوسط", branch: "عام" },
  { id: 6, name: "السادس الابتدائي", branch: "عام" }
];

let subjects = [
  { id: 101, stage_id: 1, name: "الكيمياء", price: 10000, desc: "منهج الكيمياء للفرع العلمي الأحيائي شامل المرشحات والوزاريات" },
  { id: 102, stage_id: 1, name: "الفيزياء", price: 10000, desc: "شرح القوانين وتجارب المنهج والحلول النموذجية" },
  { id: 103, stage_id: 3, name: "التاريخ والجغرافيا", price: 10000, desc: "ملخصات وتعاليل المنهج الأدبي" },
  { id: 104, stage_id: 5, name: "الاجتماعيات", price: 10000, desc: "حقيبة الثالث المتوسط الشاملة للمرشحات والخرائط" },
  { id: 105, stage_id: 6, name: "العلوم والرياضيات", price: 10000, desc: "مرشحات السادس الابتدائي الوزارية" }
];

// إنشاء مرشحات ووزاريات تلقائية لكل مادة من عام 2012 إلى 2026
let content = [];
let contentIdCounter = 1;

subjects.forEach(sub => {
  for (let year = 2026; year >= 2012; year--) {
    content.push({
      id: contentIdCounter++,
      subject_id: sub.id,
      year: year,
      type: "filter",
      title: `مرشحات والأسئلة المتوقعة لمادة ${sub.name} لسنة ${year}`,
      file_url: `#download-${sub.id}-${year}`,
      description: `أهم الأسئلة الوزارية المكررة والحلول النموذجية المعتمدة لعام ${year}`
    });
  }
});

let subscriptions = [];
let examResults = [];

// بنك أسئلة امتحان نفسي
let questionBank = {
  101: [
    { id: 1, q: "ما هي وحدة قياس الحرارة النوعية؟", options: ["J/g.°C", "J/mol", "kJ", "J.°C"], correct: 0, diff: "easy" },
    { id: 2, q: "قانون هيس يعتمد على أن الدالة هي؟", options: ["دالة حالة", "دالة مسار", "دالة شغل", "لا شيء مما سبق"], correct: 0, diff: "medium" },
    { id: 3, q: "عند زيادة الضغط على تفاعل غازي متزن، يتجه التفاعل نحو؟", options: ["المولات الأقل", "المولات الأكثر", "لا يتأثر", "يتوقف"], correct: 0, diff: "hard" }
  ],
  104: [
    { id: 1, q: "ما هو أعلى جبل في العراق؟", options: ["هلكرد", "سفين", "قنديل", "بيخال"], correct: 0, diff: "easy" },
    { id: 2, q: "مناخ العراق ينتمي إلى أي إقليم مناخي؟", options: ["المناخ الصحراوي والشبه صحراوي", "المناخ الاستوائي", "المناخ المداري", "المناخ القطبي"], correct: 0, diff: "medium" }
  ]
};

// ================= ====================================
// 2. مسارات ملفات PWA (Manifest & Service Worker)
// ======================================================

app.get('/manifest.json', (req, res) => {
  res.json({
    short_name: "طلبتي",
    name: "منصة طلبتي التعليمية | Talabti",
    icons: [
      { src: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png", type: "image/png", sizes: "192x192" },
      { src: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png", type: "image/png", sizes: "512x512" }
    ],
    start_url: "/",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "ar"
  });
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    const CACHE_NAME = 'talabti-v1';
    self.addEventListener('install', (e) => {
      e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(['/', '/manifest.json'])));
    });
    self.addEventListener('fetch', (e) => {
      e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
    });
  `);
});

// ================= ====================================
// 3. مسارات واجهة البرمجة (APIs Backend)
// ======================================================

// تسجيل جديد
app.post('/api/auth/register', (req, res) => {
  const { phone, password, full_name, gender, governorate, stage_id } = req.body;
  if (!phone || !password || !full_name || !governorate) {
    return res.status(400).json({ success: false, message: "يرجى ملء جميع البيانات المطلوب." });
  }
  if (users.find(u => u.phone === phone)) {
    return res.status(400).json({ success: false, message: "رقم الهاتف مسجل سابقاً." });
  }
  const newUser = { id: users.length + 1, phone, password, full_name, gender, governorate, stage_id: parseInt(stage_id) || 1, role: "student", points: 0 };
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

// تسجيل الدخول
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "رقم الهاتف أو كلمة المرور غير صحيحة." });
  res.json({ success: true, user });
});

// المراحل والمواد
app.get('/api/stages', (req, res) => res.json({ success: true, stages }));
app.get('/api/subjects', (req, res) => res.json({ success: true, subjects }));

// جلب المرشحات والوزاريات من 2012 إلى 2026
app.get('/api/content/:subjectId', (req, res) => {
  const { subjectId } = req.params;
  const { year } = req.query;
  let items = content.filter(c => c.subject_id == subjectId);
  if (year) items = items.filter(c => c.year == year);
  res.json({ success: true, data: items });
});

// طلب الاشتراك وتفعيل المادة (10,000 IQD)
app.post('/api/subscriptions/pay', (req, res) => {
  const { user_id, subject_id, method, receipt } = req.body;
  const newSub = {
    id: subscriptions.length + 1,
    user_id: parseInt(user_id),
    subject_id: parseInt(subject_id),
    method, // zain_cash, rafidain, rasheed, manual
    receipt,
    amount: 10000,
    status: "approved", // موافقة تلقائية فورية
    date: new Date().toISOString().split('T')[0]
  };
  subscriptions.push(newSub);
  res.json({ success: true, message: "تم تفعيل الاشتراك وتم فتح المادة بنجاح!", subscription: newSub });
});

// إتاحة المواد المشتركة للمستخدم
app.get('/api/subscriptions/user/:userId', (req, res) => {
  const userSubs = subscriptions.filter(s => s.user_id == req.params.userId && s.status === 'approved');
  res.json({ success: true, active_subject_ids: userSubs.map(s => s.subject_id) });
});

// نظام "امتحن نفسي"
app.post('/api/exams/start', (req, res) => {
  const { subject_id, count, difficulty } = req.body;
  let qList = questionBank[subject_id] || [
    { id: 99, q: "سؤال افتراضي: ما هي أهم نقطة للتركيز عليها بالامتحان الوزاري؟", options: ["فهم القوانين والحل النموذج", "الحفظ السطحي فقط", "إهمال المراجعة"], correct: 0, diff: "easy" }
  ];
  if (difficulty && difficulty !== "all") {
    qList = qList.filter(q => q.diff === difficulty);
  }
  res.json({ success: true, questions: qList.slice(0, parseInt(count) || 10) });
});

// حفظ نتيجة الامتحان
app.post('/api/exams/submit', (req, res) => {
  const { user_id, subject_id, score, total } = req.body;
  const percentage = Math.round((score / total) * 100);
  const result = { id: examResults.length + 1, user_id, subject_id, score, total, percentage, date: new Date().toLocaleDateString('ar-IQ') };
  examResults.push(result);
  res.json({ success: true, result });
});

// مساعد طلبتi AI
app.post('/api/ai/chat', (req, res) => {
  const { prompt } = req.body;
  const reply = `أهلاً بك في مساعد طلبتي الذكي 🤖\nبناءً على المنهج العراقي لـ "${prompt}": يُنصح بضبط التعاريف المكررة وزارياً للسنوات (2012-2026) واتباع خطوات الحل المعتمدة بمركز الفحص.`;
  res.json({ success: true, reply });
});

// إحصائيات الأدمن
app.get('/api/admin/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      students_count: users.filter(u => u.role === 'student').length,
      subscriptions_count: subscriptions.length,
      revenue_iqd: subscriptions.filter(s => s.status === 'approved').length * 10000,
      materials_count: subjects.length
    },
    subscriptions
  });
});

// ================= ====================================
// 4. الواجهة الأمامية الشاملة (HTML + RTL Frontend + PWA)
// ======================================================

app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طلبتي | Talabti</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#2563eb">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <style>
    body { background-color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; }
    .hero-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%); color: white; padding: 30px 15px; border-radius: 0 0 24px 24px; }
    .card-custom { border: none; border-radius: 18px; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.2s; }
    .card-custom:hover { transform: translateY(-3px); }
    .year-badge { background: #e0e7ff; color: #3730a3; font-weight: bold; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; }
    .chat-box { height: 280px; overflow-y: auto; background: #f8fafc; border-radius: 12px; padding: 12px; }
  </style>
</head>
<body>

  <!-- الهيدر الرئيسي -->
  <header class="hero-header text-center mb-4">
    <div class="container">
      <h2 class="fw-bold"><i class="bi bi-mortarboard-fill text-warning me-2"></i>طلبتي | Talabti</h2>
      <p class="small text-light mb-0" id="userInfoText">المنصة التعليمية العراقية الشاملة (2012 - 2026)</p>
    </div>
  </header>

  <div class="container mb-5">

    <!-- شريط تثبيت التطبيق PWA -->
    <div id="pwaBanner" class="alert alert-warning d-none d-flex justify-content-between align-items-center rounded-4 shadow-sm mb-4">
      <div><i class="bi bi-phone-vibrate me-2"></i> ثبت <strong>تطبيق طلبتي</strong> على شاشة هاتفك الرئيسية الآن!</div>
      <button class="btn btn-dark btn-sm rounded-pill px-3" onclick="installApp()">تثبيت</button>
    </div>

    <!-- أزرار القائمة الرئيسية -->
    <div class="d-flex gap-2 overflow-auto mb-4 pb-2">
      <button class="btn btn-primary rounded-pill px-3 flex-shrink-0" onclick="showModal('authModal')"><i class="bi bi-person-fill me-1"></i> دخول / تسجيل الطالب</button>
      <button class="btn btn-outline-primary rounded-pill px-3 flex-shrink-0" onclick="showModal('examModal')"><i class="bi bi-pencil-square me-1"></i> امتحن نفسي</button>
      <button class="btn btn-outline-info rounded-pill px-3 flex-shrink-0" onclick="showModal('aiModal')"><i class="bi bi-robot me-1"></i> مساعد طلبتي AI</button>
      <button class="btn btn-outline-success rounded-pill px-3 flex-shrink-0" onclick="showModal('adminModal')"><i class="bi bi-shield-lock me-1"></i> لوحة الأدمن</button>
    </div>

    <!-- تصفية المراحل الدراسية -->
    <div class="card card-custom p-3 mb-4">
      <h6 class="fw-bold mb-3"><i class="bi bi-funnel-fill text-primary me-2"></i>اختر المرحلة والفرع الدراسي:</h6>
      <div class="d-flex flex-wrap gap-2" id="stagesContainer"></div>
    </div>

    <!-- قائمة المواد المتاحة -->
    <h5 class="fw-bold mb-3"><i class="bi bi-book-half text-primary me-2"></i>المواد والاشتراكات:</h5>
    <div class="row g-3 mb-5" id="subjectsContainer"></div>

    <!-- عرض مرشحات ووزاريات المادة (2012 - 2026) -->
    <div id="contentSection" class="card card-custom p-4 d-none">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h5 class="fw-bold mb-0" id="currentSubjectTitle">المرشحات والأسئلة الوزارية</h5>
        <div class="d-flex align-items-center gap-2">
          <label class="small text-muted fw-bold">السنة:</label>
          <select class="form-select form-select-sm w-auto" id="filterYearSelect" onchange="loadContentByYear()">
            <option value="">جميع السنوات (2012 - 2026)</option>
            ${Array.from({length: 15}, (_, i) => 2026 - i).map(y => `<option value="${y}">${y}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="row g-3" id="contentList"></div>
    </div>

  </div>

  <!-- Modal 1: تسجيل ودخول الطالب -->
  <div class="modal fade" id="authModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title fw-bold"><i class="bi bi-person-plus-fill me-2"></i>حساب الطالب</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4">
          <ul class="nav nav-pills nav-justified mb-3" id="authTabs">
            <li class="nav-item"><button class="nav-link active" onclick="switchAuth('register')">إنشاء حساب جديد</button></li>
            <li class="nav-item"><button class="nav-link" onclick="switchAuth('login')">تسجيل الدخول</button></li>
          </ul>

          <form id="regForm" onsubmit="handleRegister(event)">
            <div class="mb-2"><label class="form-label small fw-bold">الاسم الكامل</label><input type="text" id="regName" class="form-control" required placeholder="علي محمد"></div>
            <div class="mb-2"><label class="form-label small fw-bold">رقم الهاتف (الواتساب)</label><input type="tel" id="regPhone" class="form-control" required placeholder="07700000000"></div>
            <div class="mb-2"><label class="form-label small fw-bold">كلمة المرور</label><input type="password" id="regPass" class="form-control" required placeholder="••••••••"></div>
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label small fw-bold">الجنس</label>
                <select id="regGender" class="form-select"><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select>
              </div>
              <div class="col-6">
                <label class="form-label small fw-bold">المحافظة</label>
                <select id="regGov" class="form-select">
                  ${GOVERNORATES.map(g => `<option value="${g}">${g}</option>`).join('')}
                </select>
              </div>
            </div>
            <button type="submit" class="btn btn-primary w-100 fw-bold mt-2">إنشاء حساب جديد</button>
          </form>

          <form id="loginForm" class="d-none" onsubmit="handleLogin(event)">
            <div class="mb-3"><label class="form-label small fw-bold">رقم الهاتف</label><input type="tel" id="loginPhone" class="form-control" required placeholder="07700000000"></div>
            <div class="mb-3"><label class="form-label small fw-bold">كلمة المرور</label><input type="password" id="loginPass" class="form-control" required placeholder="••••••••"></div>
            <button type="submit" class="btn btn-success w-100 fw-bold">تسجيل الدخول</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 2: الدفع والاشتراك (10,000 IQD) -->
  <div class="modal fade" id="payModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title fw-bold"><i class="bi bi-credit-card-fill me-2"></i>اشتراك المادة (10,000 دينار عراقي)</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4">
          <p class="small text-muted mb-3">اختر طريقة الدفع المناسبة لك لفتح كافة مرشحات ودروس المادة فوراً:</p>
          <div class="mb-3">
            <label class="form-label fw-bold small">طريقة الدفع:</label>
            <select id="payMethod" class="form-select">
              <option value="zain_cash">زين كاش (07700000000)</option>
              <option value="rafidain">ماستر كارد مصرف الرافدين</option>
              <option value="rasheed">ماستر كارد مصرف الرشيد</option>
              <option value="manual">دفع يدوي مع رفع الوصل</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold small">رقم التحويل / صورة الوصل</label>
            <input type="text" id="payReceipt" class="form-control" placeholder="أدخل رقم عملية التحويل هنا">
          </div>
          <button class="btn btn-success w-100 fw-bold rounded-pill" onclick="submitPayment()">تأكيد الدفع وفتح المادة</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 3: امتحن نفسي -->
  <div class="modal fade" id="examModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4 border-0">
        <div class="modal-header bg-warning text-dark">
          <h5 class="modal-title fw-bold"><i class="bi bi-ui-checks me-2"></i>نظام اختبار نفسك بالحفظ والأسئلة</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4" id="examModalBody">
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label small fw-bold">اختر المادة:</label>
              <select id="examSubjectSelect" class="form-select">
                <option value="101">الكيمياء - السادس العلمي</option>
                <option value="104">الاجتماعيات - الثالث المتوسط</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold">عدد الأسئلة:</label>
              <select id="examCountSelect" class="form-select">
                <option value="10">10 أسئلة</option>
                <option value="20">20 سؤال</option>
                <option value="50">50 سؤال</option>
                <option value="100">100 سؤال</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold">مستوى الصعوبة:</label>
              <select id="examDiffSelect" class="form-select">
                <option value="all">جميع المستويات</option>
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">صعب</option>
              </select>
            </div>
          </div>
          <button class="btn btn-warning w-100 fw-bold rounded-pill mb-3" onclick="startExam()">بدء الامتحان الآن</button>
          <div id="examQuestionsContainer"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 4: مساعد طلبتي AI -->
  <div class="modal fade" id="aiModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0">
        <div class="modal-header bg-info text-white">
          <h5 class="modal-title fw-bold"><i class="bi bi-robot me-2"></i>مساعد طلبتي الذكي AI</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-3">
          <div class="chat-box mb-3" id="aiChatBox">
            <div class="text-muted small text-center">اسأل عن أي مادة أو سؤال وزاري وسيجيبك مساعد طلبتي الذكي فوراً...</div>
          </div>
          <div class="input-group">
            <input type="text" id="aiInput" class="form-control" placeholder="اكتب سؤالك هنا...">
            <button class="btn btn-info text-white fw-bold" onclick="sendAiQuestion()">إرسال</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 5: لوحة تحكم الأدمن -->
  <div class="modal fade" id="adminModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4 border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title fw-bold"><i class="bi bi-speedometer2 me-2"></i>لوحة تحكم الأدمن (Talabti Admin)</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4" id="adminBody">
          <button class="btn btn-dark w-100 mb-3" onclick="loadAdminDashboard()">تحميل الإحصائيات والأرباح</button>
          <div id="adminStatsBox"></div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    let currentUser = null;
    let selectedSubjectForPay = null;
    let activeSubjectIds = [];
    let currentOpenSubjectId = null;

    // تسجيل Service Worker للـ PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      document.getElementById('pwaBanner').classList.remove('d-none');
    });

    function installApp() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => document.getElementById('pwaBanner').classList.add('d-none'));
      }
    }

    function showModal(id) { new bootstrap.Modal(document.getElementById(id)).show(); }

    function switchAuth(type) {
      document.querySelectorAll('#authTabs .nav-link').forEach(b => b.classList.remove('active'));
      if(type === 'register') {
        document.getElementById('regForm').classList.remove('d-none');
        document.getElementById('loginForm').classList.add('d-none');
        event.target.classList.add('active');
      } else {
        document.getElementById('regForm').classList.add('d-none');
        document.getElementById('loginForm').classList.remove('d-none');
        event.target.classList.add('active');
      }
    }

    async function handleRegister(e) {
      e.preventDefault();
      const payload = {
        full_name: document.getElementById('regName').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPass').value,
        gender: document.getElementById('regGender').value,
        governorate: document.getElementById('regGov').value
      };
      const res = await fetch('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if(data.success) {
        currentUser = data.user;
        updateUserUI();
        bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
        alert('تم إنشاء الحساب بنجاح! أهلاً بك يا بطل.');
      } else alert(data.message);
    }

    async function handleLogin(e) {
      e.preventDefault();
      const payload = {
        phone: document.getElementById('loginPhone').value,
        password: document.getElementById('loginPass').value
      };
      const res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if(data.success) {
        currentUser = data.user;
        updateUserUI();
        await fetchUserSubscriptions();
        bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
        alert('تم تسجيل الدخول بنجاح!');
      } else alert(data.message);
    }

    function updateUserUI() {
      if(currentUser) {
        document.getElementById('userInfoText').innerText = \`الطالب: \${currentUser.full_name} (\${currentUser.governorate}) | النقاط: \${currentUser.points}\`;
      }
    }

    async function loadStagesAndSubjects() {
      const resStages = await fetch('/api/stages');
      const stagesData = await resStages.json();
      document.getElementById('stagesContainer').innerHTML = stagesData.stages.map(s => \`
        <button class="btn btn-outline-dark btn-sm rounded-pill" onclick="filterSubjectsByStage(\${s.id})">\${s.name} - \${s.branch}</button>
      \`).join('');

      loadSubjects();
    }

    async function loadSubjects(stageId = null) {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      let list = data.subjects;
      if(stageId) list = list.filter(s => s.stage_id == stageId);

      document.getElementById('subjectsContainer').innerHTML = list.map(sub => {
        const isUnlocked = activeSubjectIds.includes(sub.id);
        return \`
          <div class="col-md-6 col-lg-4">
            <div class="card card-custom p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-primary">مادة منهجية</span>
                  <span class="text-success fw-bold">\${sub.price.toLocaleString()} د.ع</span>
                </div>
                <h5 class="fw-bold">\${sub.name}</h5>
                <p class="text-muted small mb-3">\${sub.desc}</p>
              </div>
              <div>
                \${isUnlocked ? 
                  \`<button class="btn btn-success w-100 rounded-3 fw-bold" onclick="openSubjectContent(\${sub.id}, '\${sub.name}')"><i class="bi bi-folder2-open me-1"></i> عرض المرشحات 2012-2026</button>\` : 
                  \`<button class="btn btn-primary w-100 rounded-3 fw-bold" onclick="openPaymentModal(\${sub.id})"><i class="bi bi-lock-fill me-1"></i> تفعيل المادة (10,000 IQD)</button>\`
                }
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function filterSubjectsByStage(id) { loadSubjects(id); }

    function openPaymentModal(subId) {
      if(!currentUser) { alert('يرجى تسجيل الدخول أولاً لتفعيل المادة'); showModal('authModal'); return; }
      selectedSubjectForPay = subId;
      showModal('payModal');
    }

    async function submitPayment() {
      const payload = {
        user_id: currentUser.id,
        subject_id: selectedSubjectForPay,
        method: document.getElementById('payMethod').value,
        receipt: document.getElementById('payReceipt').value || 'تسديد تلقائي'
      };
      const res = await fetch('/api/subscriptions/pay', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if(data.success) {
        alert(data.message);
        bootstrap.Modal.getInstance(document.getElementById('payModal')).hide();
        await fetchUserSubscriptions();
      }
    }

    async function fetchUserSubscriptions() {
      if(!currentUser) return;
      const res = await fetch(\`/api/subscriptions/user/\${currentUser.id}\`);
      const data = await res.json();
      activeSubjectIds = data.active_subject_ids;
      loadSubjects();
    }

    async function openSubjectContent(subId, title) {
      currentOpenSubjectId = subId;
      document.getElementById('currentSubjectTitle').innerText = \`مرشحات ووزاريات: \${title}\`;
      document.getElementById('contentSection').classList.remove('d-none');
      loadContentByYear();
    }

    async function loadContentByYear() {
      if(!currentOpenSubjectId) return;
      const year = document.getElementById('filterYearSelect').value;
      const res = await fetch(\`/api/content/\${currentOpenSubjectId}\${year ? '?year='+year : ''}\`);
      const data = await res.json();

      document.getElementById('contentList').innerHTML = data.data.map(item => \`
        <div class="col-md-6">
          <div class="card p-3 border-0 shadow-sm rounded-4 bg-light">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="year-badge">\${item.year}</span>
              <span class="badge bg-info text-white">مرشحات وزارية</span>
            </div>
            <h6 class="fw-bold text-dark">\${item.title}</h6>
            <p class="text-muted small mb-2">\${item.description}</p>
            <a href="\${item.file_url}" onclick="alert('جاري تحميل ملف PDF للعام \${item.year}')" class="btn btn-sm btn-outline-primary rounded-pill w-100 fw-bold"><i class="bi bi-file-earmark-pdf me-1"></i> تحميل الملزمة PDF</a>
          </div>
        </div>
      \`).join('');
    }

    async function startExam() {
      const payload = {
        subject_id: document.getElementById('examSubjectSelect').value,
        count: document.getElementById('examCountSelect').value,
        difficulty: document.getElementById('examDiffSelect').value
      };
      const res = await fetch('/api/exams/start', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();

      const container = document.getElementById('examQuestionsContainer');
      container.innerHTML = `<h6 class="fw-bold my-3 text-primary">الأسئلة (${data.questions.length}):</h6>` + data.questions.map((q, i) => `
        <div class="card p-3 mb-2 border-0 bg-light">
          <p class="fw-bold mb-2">${i+1}. ${q.q}</p>
          ${q.options.map((opt, idx) => `
            <button class="btn btn-sm btn-outline-secondary d-block w-100 text-start mb-1" onclick="alert('${idx === q.correct ? 'إجابة صحيحة ممتاز! 🎉' : 'إجابة خاطئة، حاول مجدداً ❌'}')">${opt}</button>
          `).join('')}
        </div>
      `).join('');
    }

    async function sendAiQuestion() {
      const q = document.getElementById('aiInput').value;
      if(!q) return;
      const box = document.getElementById('aiChatBox');
      box.innerHTML += `<div class="text-end mb-2"><strong>أنت:</strong> ${q}</div>`;
      document.getElementById('aiInput').value = '';

      const res = await fetch('/api/ai/chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt: q }) });
      const data = await res.json();

      box.innerHTML += `<div class="text-start text-primary mb-2"><strong>المساعد:</strong> ${data.reply}</div>`;
      box.scrollTop = box.scrollHeight;
    }

    async function loadAdminDashboard() {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      document.getElementById('adminStatsBox').innerHTML = `
        <div class="row g-2 text-center mb-3">
          <div class="col-6 col-md-3"><div class="p-3 bg-light rounded-3"><h6>الطلاب</h6><h4 class="fw-bold text-primary">${data.stats.students_count}</h4></div></div>
          <div class="col-6 col-md-3"><div class="p-3 bg-light rounded-3"><h6>الاشتراكات</h6><h4 class="fw-bold text-success">${data.stats.subscriptions_count}</h4></div></div>
          <div class="col-6 col-md-3"><div class="p-3 bg-light rounded-3"><h6>الأرباح</h6><h4 class="fw-bold text-warning">${data.stats.revenue_iqd.toLocaleString()} د.ع</h4></div></div>
          <div class="col-6 col-md-3"><div class="p-3 bg-light rounded-3"><h6>المواد</h6><h4 class="fw-bold text-info">${data.stats.materials_count}</h4></div></div>
        </div>
      `;
    }

    loadStagesAndSubjects();
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Talabti Platform Running on http://localhost:${PORT}`));
