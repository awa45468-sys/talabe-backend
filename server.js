const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(express.json());

// 1. الاتصال بـ Supabase (اختياري عند توفر المتغيرات)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// 2. تفاصيل حسابات الدفع
const PAYMENT_INFO = {
  zainCash: "07700000000",
  rafidainCard: "6280 0000 0000 0000",
  rasheedCard: "6281 0000 0000 0000",
  asiaHawala: "07710000000",
  price: "10,000 دينار عراقي"
};

// 3. API جلب الملازم والكتب
app.get('/api/books', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('books').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json([
    { id: 1, title: 'الملزمة الشاملة للاجتماعيات الوزارية', category: 'اجتماعيات', desc: 'تتضمن التاريخ، الجغرافيا، والوطنية مع حلول جميع التعاليل والخرائط والتعاريف.' },
    { id: 2, title: 'مرشحات الرياضيات - الجزء الأول', category: 'رياضيات', desc: 'حلول نموذجية وشرح مبسط لجميع الأسئلة والتمارين الوزارية المكررة.' },
    { id: 3, title: 'مرشحات الرياضيات - الجزء الثاني', category: 'رياضيات', desc: 'تغطية كاملة لفصول الهندسة والإحصاء والمجسمات مع الأسئلة المتوقعة.' },
    { id: 4, title: 'ملزمة قواعد اللغة العربية الشاملة', category: 'لغة عربية', desc: 'شرح مبسط لقواعد الثالث المتوسط مع إعراب الأمثلة والتمارين الوزارية.' },
    { id: 5, title: 'ملزمة الأدب والنصوص والإنشاء', category: 'لغة عربية', desc: 'تحليل قصائد الشعراء المطلوبة وزارياً وطرق كتابة الإنشاء الكامل.' },
    { id: 6, title: 'ملزمة اللغة الإنكليزية الذهبية', category: 'إنكليزي', desc: 'شرح قواعد المنهج، القطع الاستيعابية، والإنشاءات الوزارية المترجمة.' },
    { id: 7, title: 'ملزمة قوانين ومسائل الفيزياء', category: 'فيزياء', desc: 'شرح القوانين الرياضية، ربط المقاومات، والمشاريع مع المسائل الوزارية.' },
    { id: 8, title: 'ملزمة الكيمياء الوزارية الشاملة', category: 'كيمياء', desc: 'الترتيب الإلكتروني، المعادلات الكيميائية، والتحضيرات المطلوبة.' },
    { id: 9, title: 'ملزمة الأحياء والرسومات الوزارية', category: 'أحياء', desc: 'ملخص أجهزة الجسم مع كافة الرسومات والمخططات المطلوبة في الوزاري.' },
    { id: 10, title: 'ملزمة التربية الإسلامية والأحكام', category: 'إسلامية', desc: 'شرح أحكام التلاوة، تفسير السور الكريمة، والأحاديث الشريفة.' },
    { id: 11, title: 'بنك الوزاريات الشامل (جميع المواد)', category: 'شامل', desc: 'تجميع لكافة أسئلة الامتحانات الوزارية للسنوات السابقة مع أجوبتها النموذجية.' }
  ]);
});

// 4. API تسجيل طلبات الشراء
app.post('/api/orders', async (req, res) => {
  const { student_name, phone, book_title, payment_method, transaction_ref } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, error: 'يرجى إكمال كافة البيانات ورقم الحوالة/الوصل.' });
  }

  if (supabase) {
    try {
      await supabase.from('orders').insert([{
        student_name,
        phone,
        book_title,
        payment_method,
        transaction_ref,
        price: PAYMENT_INFO.price,
        status: 'قيد التحقق'
      }]);
    } catch (e) {}
  }

  res.json({
    success: true,
    message: 'تم إرسال طلبك ورقم الحوالة بنجاح! سيتم تفعيل وتحميل الكتاب لك عبر الواتساب فور التأكد من التحويل.'
  });
});

// 5. خدمة الواجهة الأمامية React
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 منصة تفوّق تعمل على المنفذ ${PORT}`));
