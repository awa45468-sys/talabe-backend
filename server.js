const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// الاتصال بقاعدة بيانات Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// معلومات الدفع والتحويل المعتمدة للمنصة
const PAYMENT_INFO = {
  zainCash: '07734376990',
  rafidainCard: '910100728104',
  rasheedCard: '6201 0000 0000 0000',
  asiaHawala: '07734376998',
  price: '10,000 دِينار عراقي',
  supportPhone: '9647734376950'
};

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

// API لجلب الملازم
app.get('/api/books', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('books').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json(booksData);
});

// API لتسجيل الطلبات وعمليات الشراء
app.post('/api/orders', async (req, res) => {
  const { student_name, phone, book_title, payment_method, transaction_ref, governorate } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, error: 'يرجى إكمال كافة البيانات ورقم الحوالة/الوصل' });
  }

  if (supabase) {
    try {
      await supabase.from('orders').insert([{
        student_name,
        phone,
        governorate: governorate || 'بغداد',
        book_title,
        payment_method,
        transaction_ref,
        price: PAYMENT_INFO.price,
        status: 'قيد التحقق'
      });
    } catch (e) {}
  }

  res.json({
    success: true,
    message: 'تم إرسال طلبك ورقم الحوالة بنجاح! سيتم تفعيل الكتاب وتحميله لك عبر الواتساب فور التأكد من التحويل.'
  });
});

const PORT = process.env.PORT || 3000;
app.server = app.listen(PORT, () => {
  console.log(`Talabe Backend is running on port ${PORT}`);
});

module.exports = app;
