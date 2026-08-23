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

// عرض الصفحة الرئيسية بتصميم احترافي لطلاب الثالث المتوسط
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>منصة طلبتي التعليمية</title>
        <style>
            body { font-family: Tahoma, sans-serif; background: #0f172a; color: #fff; text-align: center; padding: 20px; }
            h1 { color: #38bdf8; }
            .container { max-width: 800px; margin: auto; background: #1e293b; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
            .book { background: #334155; margin: 10px 0; padding: 15px; border-radius: 8px; text-align: right; }
            .book h3 { margin: 0 0 5px 0; color: #facc15; }
            .book p { margin: 5px 0; color: #cbd5e1; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎓 منصة طلبتي التعليمية</h1>
            <p>المتجر الرسمي للملازم والمرشحات الوزارية المعتمدة للصف الثالث المتوسط 2026</p>
            <hr style="border-color: #475569;">
            <h2>📚 قائمة الملازم والمرشحات المتاحة:</h2>
            <div id="books-list">
                ${booksData.map(b => `
                    <div class="book">
                        <h3>${b.title} (${b.pages})</h3>
                        <p>👨‍🏫 ${b.teacher} | التصنيف: ${b.category}</p>
                        <p>${b.desc}</p>
                        <span style="color: #4ade80; font-weight: bold;">السعر: 10,000 د.ع</span>
                    </div>
                `).join('')}
            </div>
        </div>
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
