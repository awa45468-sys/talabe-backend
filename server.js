const express = require('express');
const app = express();
app.use(express.json());

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
            body { background-color: #070913; color: #fff; display: flex; flex-direction: column; min-height: 100vh; }
            .header { padding: 15px 20px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; position: sticky; top: 0; z-index: 100; }
            .logo { color: #38bdf8; font-weight: bold; font-size: 16px; }
            .content { flex: 1; padding: 20px; max-width: 600px; width: 100%; margin: 0 auto; }
            .card { background: #1e293b; padding: 15px; border-radius: 14px; margin-bottom: 12px; border: 1px solid #334155; }
            .btn { background: #2563eb; color: #fff; border: none; padding: 12px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; display: block; margin-top: 10px; font-size: 14px; }
            .nav-bar { display: flex; justify-content: space-around; background: #111827; padding: 12px 0; border-top: 1px solid #1e293b; position: fixed; bottom: 0; left: 0; right: 0; }
            .nav-item { color: #94a3b8; font-size: 12px; text-align: center; cursor: pointer; background: none; border: none; }
            .nav-item.active { color: #38bdf8; font-weight: bold; }
            .screen { display: none; padding-bottom: 70px; }
            .screen.active { display: block; }
            input { width: 100%; padding: 12px; margin-bottom: 12px; background: #0b0f19; color: #fff; border: 1px solid #334155; border-radius: 8px; font-size: 14px; }
        </style>
    </head>
    <body>

        <div class="header">
            <div class="logo">📖 منصة طلبتي</div>
            <div style="font-size: 12px; color: #facc15;">الثالث المتوسط 2026</div>
        </div>

        <div class="content">
            <!-- 1. شاشة تسجيل الدخول -->
            <div id="s-login" class="screen">
                <div style="text-align:center; margin: 30px 0;">
                    <h2 style="color:#38bdf8; margin-bottom: 5px;">مرحباً بك</h2>
                    <p style="color:#94a3b8; font-size: 13px;">سجل الدخول إلى مكتبتك الدراسية</p>
                </div>
                <div class="card">
                    <label style="font-size: 12px; color: #94a3b8;">البريد الإلكتروني</label>
                    <input type="text" value="ahmed.student@talabe.iq" readonly>
                    <label style="font-size: 12px; color: #94a3b8;">كلمة المرور</label>
                    <input type="password" value="12345" readonly>
                    <button class="btn" onclick="showScreen('home')">تسجيل الدخول</button>
                </div>
            </div>

            <!-- 2. الرئيسية -->
            <div id="s-home" class="screen active">
                <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 20px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
                    <h3 style="margin-bottom: 8px; font-size: 18px;">كل الكتب بين يديك</h3>
                    <p style="font-size: 12px; opacity: 0.9;">تحميل مستويات عالية ودقة سريعة وأنيقة</p>
                    <button style="background:#fff; color:#1d4ed8; border:none; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:bold; margin-top:10px; cursor:pointer;" onclick="showScreen('library')">استكشف الآن</button>
                </div>
                <p style="font-weight:bold; margin-bottom:10px; color:#facc15; font-size: 14px;">الأقسام الدراسية:</p>
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">📐 الرياضيات</div>
                    <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">📚 اللغة العربية</div>
                    <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">🧪 العلوم والفيزياء</div>
                    <div class="card" style="text-align:center; cursor:pointer;" onclick="showScreen('library')">🏛️ الاجتماعيات</div>
                </div>
            </div>

            <!-- 3. المكتبة -->
            <div id="s-library" class="screen">
                <h3 style="color:#38bdf8; margin-bottom: 15px; font-size: 16px;">المكتبة الوزارية الشاملة</h3>
                <div class="card">
                    <p style="font-weight:bold; font-size: 14px;">الرياضيات - الثالث المتوسط</p>
                    <p style="color:#94a3b8; font-size: 12px; margin: 6px 0;">الأستاذ حيدر وليد | ⭐ 4.8</p>
                    <button class="btn" onclick="showScreen('details')">عرض تفاصيل الكتاب</button>
                </div>
                <div class="card">
                    <p style="font-weight:bold; font-size: 14px;">اللغة العربية - الثالث المتوسط</p>
                    <p style="color:#94a3b8; font-size: 12px; margin: 6px 0;">الأستاذ حمزة الجابري | ⭐ 4.7</p>
                    <button class="btn" onclick="showScreen('details')">عرض تفاصيل الكتاب</button>
                </div>
            </div>

            <!-- 4. تفاصيل الكتاب -->
            <div id="s-details" class="screen">
                <div class="card" style="text-align:center; padding: 20px;">
                    <h3 style="color:#38bdf8; margin-bottom: 10px; font-size: 16px;">رياضيات الثالث المتوسط</h3>
                    <p style="color:#facc15; margin-bottom: 12px;">⭐⭐⭐⭐⭐ (4.8 تقييم)</p>
                    <div style="text-align:right; font-size: 13px; color:#cbd5e1; background:#0b0f19; padding:12px; border-radius:8px; margin-bottom:15px;">
                        <p style="margin-bottom: 4px;">📅 سنة النشر: 2026</p>
                        <p style="margin-bottom: 4px;">🏛️ وزارة التربية والتعليم</p>
                        <p style="margin-bottom: 4px;">📄 عدد الصفحات: 320 صفحة</p>
                        <p>💾 الحجم: 18.7 MB</p>
                    </div>
                    <button class="btn" style="background:#059669;" onclick="alert('تم بدء تحميل الكتاب بنجاح!')">تحميل الكتاب (PDF)</button>
                </div>
            </div>

            <!-- 5. الملف الشخصي -->
            <div id="s-profile" class="screen" style="text-align:center;">
                <div style="font-size:40px; margin-bottom:8px;">👨‍💻</div>
                <h3 style="color:#facc15; font-size: 18px;">أحمد محمد</h3>
                <p style="color:#94a3b8; font-size: 13px; margin-bottom: 20px;">طالب - ثالث متوسط خارجي</p>
                <div style="text-align:right;">
                    <div class="card">📚 المكتبة (11 كتاب محفوظ)</div>
                    <div class="card">⭐ الكتب المفضلة</div>
                    <div class="card">📥 التحميلات الوزارية</div>
                    <div class="card" style="color:#ef4444; cursor:pointer; text-align:center;" onclick="showScreen('login')">🚪 تسجيل الخروج</div>
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

        <script>
            function showScreen(name) {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                
                document.getElementById('s-' + name).classList.add('active');
                document.getElementById('nav-btn-' + name).classList.add('active');
                window.scrollTo(0, 0);
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
