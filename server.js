const express = require('express');
const app = express();
app.use(express.json());

// قائمة الملازم والمرشحات الرسمية لمنصة طلبتي
const booksData = [
  { id: 1, title: 'مرشحات منصة طلبتي - الاجتماعيات الشاملة', category: 'اجتماعيات', teacher: 'الأستاذ قصي الدليمي', pages: '190 صفحة', desc: 'أبرز الأسئلة الوزارية المتكررة في التاريخ والجغرافيا والوطنية مع حلول نموذجية دقيقة.' },
  { id: 2, title: 'مرشحات منصة طلبتي - الرياضيات (الجزء الأول)', category: 'رياضيات', teacher: 'الأستاذ حيدر وليد', pages: '165 صفحة', desc: 'أهم المسائل والتمارين المرشحة للفصول الأربعة الأولى بأسلوب مبسط.' },
  { id: 3, title: 'مرشحات منصة طلبتي - الرياضيات (الجزء الثاني)', category: 'رياضيات', teacher: 'الأستاذ حيدر وليد', pages: '150 صفحة', desc: 'أقوى مرشحات الهندسة والإحصاء والمجسمات المتوقعة بنسبة 100%.' },
  { id: 4, title: 'مرشحات منصة طلبتي - قواعد اللغة العربية', category: 'لغة عربية', teacher: 'الأستاذ حمزة الجابري', pages: '180 صفحة', desc: 'أهم فروع القواعد والإعراب والتمارين الوزارية المكررة.' },
  { id: 5, title: 'مرشحات منصة طلبتي - الأدب والنصوص والإنشاء', category: 'لغة عربية', teacher: 'الأستاذ حمزة الجابري', pages: '140 صفحة', desc: 'حفظ الشعراء والمناقشة وأفضل طرق كتابة الإنشاء الوزاري.' },
  { id: 6, title: 'مرشحات منصة طلبتي - اللغة الإنكليزية', category: 'إنكليزي', teacher: 'الأستاذ محمد العبيدي', pages: '175 صفحة', desc: 'أبرز القطع الاستيعابية والقواعد والإنشاءات الوزارية المرشحة.' },
  { id: 7, title: 'مرشحات منصة طلبتي - الفيزياء والمسائل', category: 'فيزياء', teacher: 'الأستاذ مؤيد سليم', pages: '160 صفحة', desc: 'أهم المسائل الرياضية وربط المقاومات والوزاريات المهمة.' },
  { id: 8, title: 'مرشحات منصة طلبتي - الكيمياء الوزارية', category: 'كيمياء', teacher: 'الأستاذ مهند السوداني', pages: '155 صفحة', desc: 'أبرز المعادلات الكيميائية المتزنة والتحضيرات والكشوفات.' },
  { id: 9, title: 'مرشحات منصة طلبتي - الأحياء والرسومات', category: 'أحياء', teacher: 'الأستاذ ماهر نايف', pages: '145 صفحة', desc: 'أهم الرسومات الوزارية المطلوبة بدقة مع التعاريف والتعاليل.' },
  { id: 10, title: 'مرشحات منصة طلبتي - التربية الإسلامية', category: 'إسلامية', teacher: 'الأستاذ أحمد النعيمي', pages: '120 صفحة', desc: 'أبرز أحكام التلاوة والمعاني وتفسير السور الكريمة والأحاديث.' },
  { id: 11, title: 'بنك مرشحات منصة طلبتي الشامل (جميع المواد)', category: 'شامل', teacher: 'نخبة الأساتذة الأوائل', pages: '320 صفحة', desc: 'النسخة النهائية المرشحة لجميع الامتحانات الوزارية للأدوار السابقة.' }
];

// عرض الصفحة الرئيسية بتصميم الشاشات الخماسية الفاخرة
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
            body { background-color: #0b0f19; color: #fff; text-align: center; padding: 20px; }
            header { padding: 25px 0; border-bottom: 1px solid #1e293b; margin-bottom: 30px; }
            h1 { color: #38bdf8; font-size: 28px; margin-bottom: 8px; }
            p { color: #94a3b8; font-size: 14px; }
            .showcase { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; max-width: 1200px; margin: auto; }
            .phone-frame { width: 280px; background: #111827; border-radius: 35px; border: 4px solid #334155; padding: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: right; position: relative; }
            .screen-title { color: #facc15; font-size: 13px; font-weight: bold; margin-bottom: 10px; text-align: center; }
            .app-screen { background: #0f172a; border-radius: 20px; padding: 12px; height: 480px; overflow-y: auto; font-size: 11px; }
            .app-screen::-webkit-scrollbar { width: 4px; }
            .app-screen::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
            .card { background: #1e293b; padding: 10px; border-radius: 10px; margin-bottom: 8px; }
            .btn { background: #2563eb; color: #fff; border: none; padding: 8px; width: 100%; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 5px; }
            .badge { background: #38bdf8; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
        </style>
    </head>
    <body>

        <header>
            <h1>🎓 منصة طلبتي التعليمية</h1>
            <p>معرض الشاشات الخمس والمنهاج الوزاري المعتمد للصف الثالث المتوسط 2026</p>
        </header>

        <div class="showcase">
            <!-- شاشة تسجيل الدخول -->
            <div class="phone-frame">
                <div class="screen-title">1. شاشة تسجيل الدخول</div>
                <div class="app-screen">
                    <h3 style="color:#38bdf8; text-align:center; margin-bottom:10px;">منصة طلبتي</h3>
                    <div class="card" style="text-align:center;">
                        <p style="font-weight:bold; margin-bottom:5px;">مرحباً بك</p>
                        <input type="text" value="ahmed.student@talabe.iq" style="width:100%; padding:5px; margin-bottom:5px; background:#0f172a; color:#fff; border:1px solid #334155; border-radius:4px; font-size:10px;" readonly>
                        <input type="password" value="*****" style="width:100%; padding:5px; margin-bottom:8px; background:#0f172a; color:#fff; border:1px solid #334155; border-radius:4px;" readonly>
                        <button class="btn">تسجيل الدخول</button>
                    </div>
                </div>
            </div>

            <!-- شاشة الرئيسية والأقسام -->
            <div class="phone-frame">
                <div class="screen-title">2. شاشة الرئيسية والأقسام</div>
                <div class="app-screen">
                    <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding:10px; border-radius:10px; margin-bottom:10px; text-align:center;">
                        <p style="font-weight:bold; font-size:12px;">كل الكتب بين يديك</p>
                        <button style="background:#fff; color:#1d4ed8; border:none; padding:4px 10px; border-radius:4px; font-size:9px; font-weight:bold; margin-top:5px;">استكشاف الآن</button>
                    </div>
                    <p style="font-weight:bold; margin-bottom:5px; color:#facc15;">الأقسام:</p>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:5px; margin-bottom:10px;">
                        <div class="card" style="text-align:center; padding:6px;"> رياضيات</div>
                        <div class="card" style="text-align:center; padding:6px;"> اللغة العربية</div>
                        <div class="card" style="text-align:center; padding:6px;"> العلوم</div>
                        <div class="card" style="text-align:center; padding:6px;"> الاجتماعيات</div>
                    </div>
                </div>
            </div>

            <!-- شاشة المكتبة والفلاتر -->
            <div class="phone-frame">
                <div class="screen-title">3. شاشة المكتبة والفلاتر</div>
                <div class="app-screen">
                    <p style="font-weight:bold; margin-bottom:8px; text-align:center; color:#38bdf8;">المكتبة الوزارية</p>
                    <div class="card">
                        <p style="font-weight:bold;">مرشحات الرياضيات - الجزء الأول</p>
                        <p style="color:#94a3b8;">الأستاذ حيدر وليد | <span class="badge">165 صفحة</span></p>
                        <button class="btn" style="background:#059669;">تحميل الملزمة 10,000 د.ع</button>
                    </div>
                    <div class="card">
                        <p style="font-weight:bold;">مرشحات الاجتماعيات الشاملة</p>
                        <p style="color:#94a3b8;">الأستاذ قصي الدليمي | <span class="badge">190 صفحة</span></p>
                        <button class="btn" style="background:#059669;">تحميل الملزمة 10,000 د.ع</button>
                    </div>
                </div>
            </div>

            <!-- شاشة الملف الشخصي -->
            <div class="phone-frame">
                <div class="screen-title">4. الملف الشخصي</div>
                <div class="app-screen" style="text-align:center;">
                    <div style="font-size:24px; margin-bottom:5px;">👨‍💻</div>
                    <p style="font-weight:bold; font-size:13px; color:#facc15;">أحمد محمد</p>
                    <p style="color:#94a3b8; margin-bottom:10px;">طالب - ثالث متوسط</p>
                    <div style="text-align:right;">
                        <div class="card" style="padding:6px; margin-bottom:4px;">📚 المكتبة (11 كتاب)</div>
                        <div class="card" style="padding:6px; margin-bottom:4px;">⭐ المفضلة</div>
                        <div class="card" style="padding:6px; margin-bottom:4px;">📥 التحميلات الوزارية</div>
                        <div class="card" style="padding:6px; margin-bottom:4px;">🔔 الإشعارات</div>
                    </div>
                </div>
            </div>

            <!-- شاشة تفاصيل الكتاب -->
            <div class="phone-frame">
                <div class="screen-title">5. تفاصيل الكتاب</div>
                <div class="app-screen">
                    <div class="card" style="text-align:center;">
                        <p style="font-weight:bold; color:#38bdf8; font-size:12px;">رياضيات الثالث المتوسط</p>
                        <p style="color:#facc15; margin:4px 0;">⭐⭐⭐⭐⭐ (4.8 تقييم)</p>
                        <p style="font-size:10px; color:#cbd5e1; text-align:right; margin:6px 0;">السنة: 2026<br>وزارة التربية | 320 صفحة<br>الحجم: 18.7 MB</p>
                        <button class="btn" style="background:#2563eb;">تحميل الكتاب الكامل (PDF)</button>
                    </div>
                </div>
            </div>
        </div>

        <footer style="margin-top:30px; padding:15px; border-top:1px solid #1e293b; color:#64748b; font-size:12px;">
            منصة طلبتي التعليمية © 2026 • مبرمجة لطلاب العراق 🇮🇶
        </footer>

    </body>
    </html>
  `);
});

// API لجلب الملازم
app.get('/api/books', (req, res) => {
  res.json(booksData);
});

// API لتسجيل الطلبات
app.post('/api/orders', (req, res) => {
  const { student_name, phone, book_title, transaction_ref } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, error: 'يرجى إكمال كافة البيانات ورقم الحوالة' });
  }
  res.json({
    success: true,
    message: 'تم إرسال طلبك بنجاح! سيتم تفعيل الكتاب وتحميله لك عبر الواتساب.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
