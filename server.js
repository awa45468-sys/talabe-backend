const express = require('express');
const app = express();
app.use(express.json());

// قائمة الكتب والملازم الوزارية الكاملة لمنصة طلبتي
const booksData = [
  { id: 1, title: 'رياضيات الثالث المتوسط - الجزء الأول', category: 'رياضيات', teacher: 'الأستاذ حيدر وليد', pages: '165 صفحة', rating: '4.8', size: '18.7 MB', year: '2026' },
  { id: 2, title: 'اللغة العربية - الثالث المتوسط', category: 'عربي', teacher: 'الأستاذ حمزة الجابري', pages: '180 صفحة', rating: '4.7', size: '14.5 MB', year: '2026' },
  { id: 3, title: 'اللغة الإنكليزية - الثالث المتوسط', category: 'إنكليزي', teacher: 'الأستاذ محمد العبيدي', pages: '175 صفحة', rating: '4.9', size: '16.2 MB', year: '2026' },
  { id: 4, title: 'الاجتماعيات - الثالث المتوسط', category: 'اجتماعيات', teacher: 'الأستاذ قصي الدليمي', pages: '190 صفحة', rating: '4.9', size: '15.1 MB', year: '2026' }
];

// التطبيق التفاعلي الحقيقي لمنصة طلبتي
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>منصة طلبتي - المناهج الوزارية 2026</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: Tahoma, sans-serif; }
            body { background-color: #070913; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 10px; }
            .phone-container { width: 100%; max-width: 410px; height: 840px; background: #0f172a; border-radius: 40px; border: 6px solid #1e293b; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.6); position: relative; }
            .header { padding: 15px 20px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; }
            .logo { color: #38bdf8; font-weight: bold; font-size: 16px; }
            .content { flex: 1; overflow-y: auto; padding: 15px; }
            .card { background: #1e293b; padding: 12px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #334155; }
            .btn { background: #2563eb; color: #fff; border: none; padding: 10px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; display: block; margin-top: 8px; }
            .nav-bar { display: flex; justify-content: space-around; background: #111827; padding: 12px 0; border-top: 1px solid #1e293b; }
            .nav-item { color: #94a3b8; font-size: 11px; text-align: center; cursor: pointer; background: none; border: none; }
            .nav-item.active { color: #38bdf8; font-weight: bold; }
            .screen { display: none; }
            .screen.active { display: block; }
            input { width: 100%; padding: 10px; margin-bottom: 10px; background: #0b0f19; color: #fff; border: 1px solid #334155; border-radius: 8px; }
        </style>
    </head>
    <body>

        <div class="phone-container">
            <!-- الهيدر -->
            <div class="header">
                <div class="logo">📖 منصة طلبتي</div>
                <div style="font-size: 12px; color: #facc15;">الثلاث المتوسط 2026</div>
            </div>

            <!-- شاشات التطبيق -->
            <div class="content">
                
                <!-- 1. شاشة تسجيل الدخول -->
                <div id="screen-login" class="screen">
                    <div style="text-align:center; margin: 40px 0;">
                        <h2 style="color:#38bdf8; margin-bottom: 5px;">مرحباً بك</h2>
                        <p style="color:#94a3b8; font-size: 12px;">سجل الدخول إلى مكتبتك الدراسية</p>
                    </div>
                    <div class="card">
                        <label style="font-size: 11px; color: #94a3b8;">البريد الإلكتروني</label>
                        <input type="text" value="ahmed.student@talabe.iq" readonly>
                        <label style="font-size: 11px; color: #94a3b8;">كلمة المرور</label>
                        <input type="password" value="12345" readonly>
                        <button class="btn" onclick="switchScreen('home')">تسجيل الدخول</button>
                    </div>
                </div>

                <!-- 2. الشاشة الرئيسية والأقسام -->
                <div id="screen-home" class="screen active">
                    <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: center;">
                        <h3 style="margin-bottom: 5px;">كل الكتب بين يديك</h3>
                        <p style="font-size: 11px; opacity: 0.8;">تحميل مستويات عالية، دقة سمولة وأنيقة</p>
                        <button style="background:#fff; color:#1d4ed8; border:none; padding:6px 14px; border-radius:6px; font-size:11px; font-weight:bold; margin-top:8px; cursor:pointer;" onclick="switchScreen('library')">استكشف الآن</button>
                    </div>
                    <p style="font-weight:bold; margin-bottom:8px; color:#facc15; font-size: 13px;">الأقسام الدراسية:</p>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="switchScreen('library')">📐 الرياضيات</div>
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="switchScreen('library')">📚 اللغة العربية</div>
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="switchScreen('library')">🧪 العلوم والاجتماعيات</div>
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="switchScreen('library')">💻 الحاسوب والإنكليزي</div>
                    </div>
                </div>

                <!-- 3. شاشة المكتبة -->
                <div id="screen-library" class="screen">
                    <h3 style="color:#38bdf8; margin-bottom: 12px; font-size: 14px;">المكتبة الوزارية الشاملة</h3>
                    <div class="card">
                        <p style="font-weight:bold; font-size: 13px;">الرياضيات - الثالث المتوسط</p>
                        <p style="color:#94a3b8; font-size: 11px; margin: 4px 0;">وزارة التربية | ⭐ 4.8</p>
                        <button class="btn" onclick="switchScreen('details')">عرض تفاصيل الكتاب</button>
                    </div>
                    <div class="card">
                        <p style="font-weight:bold; font-size: 13px;">اللغة العربية - الثالث المتوسط</p>
                        <p style="color:#94a3b8; font-size: 11px; margin: 4px 0;">وزارة التربية | ⭐ 4.7</p>
                        <button class="btn" onclick="switchScreen('details')">عرض تفاصيل الكتاب</button>
                    </div>
                </div>

                <!-- 4. شاشة تفاصيل الكتاب -->
                <div id="screen-details" class="screen">
                    <div class="card" style="text-align:center; padding: 20px;">
                        <h3 style="color:#38bdf8; margin-bottom: 8px;">رياضيات الثالث المتوسط</h3>
                        <p style="color:#facc15; margin-bottom: 10px;">⭐⭐⭐⭐⭐ (4.8 تقييم)</p>
                        <div style="text-align:right; font-size: 12px; color:#cbd5e1; background:#0b0f19; padding:10px; border-radius:8px; margin-bottom:10px;">
                            <p>📅 سنة النشر: 2026</p>
                            <p>🏛️ وزارة التربية والتعليم</p>
                            <p>📄 عدد الصفحات: 320 صفحة</p>
                            <p>💾 الحجم: 18.7 MB</p>
                        </div>
                        <button class="btn" style="background:#059669;" onclick="alert('جاري تحميل الكتاب بصيغة PDF بنجاح!')">تحميل الكتاب الكامل (PDF)</button>
                    </div>
                </div>

                <!-- 5. شاشة الملف الشخصي -->
                <div id="screen-profile" class="screen" style="text-align:center;">
                    <div style="font-size:32px; margin-bottom:5px;">👨‍💻</div>
                    <h3 style="color:#facc15; font-size: 15px;">أحمد محمد</h3>
                    <p style="color:#94a3b8; font-size: 12px; margin-bottom: 15px;">طالب - ثالث متوسط خارجي</p>
                    <div style="text-align:right;">
                        <div class="card">📚 الكتب المحفوظة (11 كتاب)</div>
                        <div class="card">⭐ الكتب المفضلة</div>
                        <div class="card">📥 التحميلات السابقة</div>
                        <div class="card" style="color:#ef4444; cursor:pointer;" onclick="switchScreen('login')">🚪 تسجيل الخروج</div>
                    </div>
                </div>

            </div>

            <!-- شريط التنقل السفلي -->
            <div class="nav-bar">
                <button class="nav-item" onclick="switchScreen('profile')" id="nav-profile">👤 الملف</button>
                <button class="nav-item" onclick="switchScreen('library')" id="nav-library">📚 المكتبة</button>
                <button class="nav-item active" onclick="switchScreen('home')" id="nav-home">🏠 الرئيسية</button>
                <button class="nav-item" onclick="switchScreen('login')" id="nav-login">🔐 الدخول</button>
            </div>
        </div>

        <script>
            function switchScreen(screenName) {
                // إخفاء كل الشاشات
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                
                // إظهار الشاشة المطلوبة
                document.getElementById('screen--' + screenName).classList.add('active'); // سيتم تصحيحها بالأسفل
            }
        </script>
    </body>
    </html>
  `);
});

// تصحيح دالة تبديل الشاشات برمجياً بسلاسة
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>منصة طلبتي - المناهج الوزارية 2026</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: Tahoma, sans-serif; }
            body { background-color: #070913; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 10px; }
            .phone-container { width: 100%; max-width: 410px; height: 820px; background: #0f172a; border-radius: 35px; border: 5px solid #1e293b; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.7); }
            .header { padding: 15px 20px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; }
            .logo { color: #38bdf8; font-weight: bold; font-size: 15px; }
            .content { flex: 1; overflow-y: auto; padding: 15px; }
            .card { background: #1e293b; padding: 12px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #334155; }
            .btn { background: #2563eb; color: #fff; border: none; padding: 10px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; display: block; margin-top: 8px; }
            .nav-bar { display: flex; justify-content: space-around; background: #111827; padding: 12px 0; border-top: 1px solid #1e293b; }
            .nav-item { color: #94a3b8; font-size: 11px; text-align: center; cursor: pointer; background: none; border: none; }
            .nav-item.active { color: #38bdf8; font-weight: bold; }
            .screen { display: none; }
            .screen.active { display: block; }
            input { width: 100%; padding: 10px; margin-bottom: 10px; background: #0b0f19; color: #fff; border: 1px solid #334155; border-radius: 8px; }
        </style>
    </head>
    <body>

        <div class="phone-container">
            <div class="header">
                <div class="logo">📖 منصة طلبتي</div>
                <div style="font-size: 11px; color: #facc15;">الثالث المتوسط 2026</div>
            </div>

            <div class="content">
                <!-- 1. شاشة تسجيل الدخول -->
                <div id="s-login" class="screen">
                    <div style="text-align:center; margin: 40px 0;">
                        <h2 style="color:#38bdf8; margin-bottom: 5px;">مرحباً بك</h2>
                        <p style="color:#94a3b8; font-size: 12px;">سجل الدخول إلى مكتبتك الدراسية</p>
                    </div>
                    <div class="card">
                        <label style="font-size: 11px; color: #94a3b8;">البريد الإلكتروني</label>
                        <input type="text" value="ahmed.student@talabe.iq" readonly>
                        <label style="font-size: 11px; color: #94a3b8;">كلمة المرور</label>
                        <input type="password" value="12345" readonly>
                        <button class="btn" onclick="showScreen('home')">تسجيل الدخول</button>
                    </div>
                </div>

                <!-- 2. الرئيسية -->
                <div id="s-home" class="screen active">
                    <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 15px; border-radius: 14px; margin-bottom: 15px; text-align: center;">
                        <h3 style="margin-bottom: 5px;">كل الكتب بين يديك</h3>
                        <p style="font-size: 11px; opacity: 0.9;">تحميل مستويات عالية ودقة سريعة</p>
                        <button style="background:#fff; color:#1d4ed8; border:none; padding:6px 14px; border-radius:6px; font-size:11px; font-weight:bold; margin-top:8px; cursor:pointer;" onclick="showScreen('library')">استكشف الآن</button>
                    </div>
                    <p style="font-weight:bold; margin-bottom:8px; color:#facc15; font-size: 13px;">الأقسام الدراسية:</p>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">📐 الرياضيات</div>
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">📚 اللغة العربية</div>
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">🧪 العلوم والفيزياء</div>
                        <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">🏛️ الاجتماعيات</div>
                    </div>
                </div>

                <!-- 3. المكتبة -->
                <div id="s-library" class="screen">
                    <h3 style="color:#38bdf8; margin-bottom: 12px; font-size: 14px;">المكتبة الوزارية الشاملة</h3>
                    <div class="card">
                        <p style="font-weight:bold; font-size: 13px;">الرياضيات - الثالث المتوسط</p>
                        <p style="color:#94a3b8; font-size: 11px; margin: 4px 0;">الأستاذ حيدر وليد | ⭐ 4.8</p>
                        <button class="btn" onclick="showScreen('details')">عرض تفاصيل الكتاب</button>
                    </div>
                    <div class="card">
                        <p style="font-weight:bold; font-size: 13px;">اللغة العربية - الثالث المتوسط</p>
                        <p style="color:#94a3b8; font-size: 11px; margin: 4px 0;">الأستاذ حمزة الجابري | ⭐ 4.7</p>
                        <button class="btn" onclick="showScreen('details')">عرض تفاصيل الكتاب</button>
                    </div>
                </div>

                <!-- 4. تفاصيل الكتاب -->
                <div id="s-details" class="screen">
                    <div class="card" style="text-align:center; padding: 15px;">
                        <h3 style="color:#38bdf8; margin-bottom: 8px;">رياضيات الثالث المتوسط</h3>
                        <p style="color:#facc15; margin-bottom: 10px;">⭐⭐⭐⭐⭐ (4.8 تقييم)</p>
                        <div style="text-align:right; font-size: 12px; color:#cbd5e1; background:#0b0f19; padding:10px; border-radius:8px; margin-bottom:10px;">
                            <p>📅 سنة النشر: 2026</p>
                            <p>🏛️ وزارة التربية والتعليم</p>
                            <p>📄 عدد الصفحات: 320 صفحة</p>
                            <p>💾 الحجم: 18.7 MB</p>
                        </div>
                        <button class="btn" style="background:#059669;" onclick="alert('تم بدء تحميل الكتاب بنجاح!')">تحميل الكتاب (PDF)</button>
                    </div>
                </div>

                <!-- 5. الملف الشخصي -->
                <div id="s-profile" class="screen" style="text-align:center;">
                    <div style="font-size:32px; margin-bottom:5px;">👨‍💻</div>
                    <h3 style="color:#facc15; font-size: 15px;">أحمد محمد</h3>
                    <p style="color:#94a3b8; font-size: 12px; margin-bottom: 15px;">طالب - ثالث متوسط خارجي</p>
                    <div style="text-align:right;">
                        <div class="card">📚 المكتبة (11 كتاب محفوظ)</div>
                        <div class="card">⭐ الكتب المفضلة</div>
                        <div class="card">📥 التحميلات الوزارية</div>
                        <div class="card" style="color:#ef4444; cursor:pointer;" onclick="showScreen('login')">🚪 تسجيل الخروج</div>
                    </div>
                </div>
            </div>

            <!-- شريط التنقل السفلي -->
            <div class="nav-bar">
                <button class="nav-item" onclick="showScreen('profile')" id="nav-btn-profile">👤 الملف</button>
                <button class="nav-item" onclick="showScreen('library')" id="nav-btn-library">📚 المكتبة</button>
                <button class="nav-item active" onclick="showScreen('home')" id="nav-btn-home">🏠 الرئيسية</button>
                <button class="nav-item" onclick="showScreen('login')" id="nav-btn-login">🔐 الدخول</button>
            </div>
        </div>

        <script>
            function showScreen(name) {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                
                document.getElementById('s-' + name).classList.add('active');
                document.getElementById('nav-btn-' + name).classList.add('active');
            }
        </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Talabe app running on port ${PORT}`);
});

module.exports = app;
