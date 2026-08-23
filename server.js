const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// 1. الاتصال بـ Supabase (اختياري وبدون إيقاف السيرفر)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// 2. معلومات الدفع والواتساب
const PAYMENT_INFO = {
  zainCash: "07734378998",
  asiaHawala: "07710000000", // اتركه هكذا أو قم بتغييره إن أردت
  rafidainCard: "910160728184",
  whatsappPhone: "9647734378998", 
  price: "10,000 دينار عراقي"
};

// 3. قائمة الملازم الافتراضية
const DEFAULT_BOOKS = [
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
];

// 4. API جلب الملازم
app.get('/api/books', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('books').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) return res.json(data);
    } catch (e) {}
  }
  res.json(DEFAULT_BOOKS);
});

// 5. API تسجيل الطلبات
app.post('/api/orders', async (req, res) => {
  const { student_name, phone, book_title, payment_method, transaction_ref } = req.body;
  if (!student_name || !phone || !book_title || !transaction_ref) {
    return res.status(400).json({ success: false, error: 'يرجى إكمال كافة البيانات ورقم الحوالة.' });
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

  res.json({ success: true, message: 'تم إرسال الطلب بنجاح!' });
});

// 6. الواجهة المباشرة كاملة والتفاعلية
app.get('/', async (req, res) => {
  let books = DEFAULT_BOOKS;
  if (supabase) {
    try {
      const { data } = await supabase.from('books').select('*').order('id', { ascending: true });
      if (data && data.length > 0) books = data;
    } catch (e) {}
  }

  const booksOptions = books.map(b => `<option value="${b.title}">${b.title} (${b.category || 'عام'})</option>`).join('');

  const booksCards = books.map(b => `
    <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4 hover:shadow-md transition">
      <div class="flex items-center justify-between mb-2">
          <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">🏷️ ${PAYMENT_INFO.price}</span>
          <span class="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">${b.category || b.name || 'عام'}</span>
      </div>
      <h2 class="text-lg font-bold text-slate-800 mb-1">${b.title}</h2>
      <p class="text-xs text-slate-500 mb-4 leading-relaxed">${b.desc || b.description || ''}</p>
      <button onclick="selectBook('${b.title}')" class="w-full bg-[#212e81] hover:bg-[#1a2468] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition text-center">
          <span>اختيار للشراء</span> 🛒
      </button>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تطبيق طلبتي - منصة تفوّق التعليمية</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
    </head>
    <body class="bg-slate-50 font-['Tajawal'] pb-12">
        <header class="bg-gradient-to-b from-[#1e1b4b] via-[#2b02f6] to-[#3b02f6] text-white pt-10 pb-16 px-6 text-center">
            <h1 class="text-3xl font-extrabold mb-2">تطبيق طلبتي</h1>
            <p class="text-slate-200 text-sm max-w-md mx-auto">المتجر الرسمي لملازم ومرشحات الثالث المتوسط</p>
        </header>

        <main class="max-w-md mx-auto px-4 -mt-8 space-y-6">
            <!-- تفاصيل أرقام التحويل -->
            <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 text-right">
                <h3 class="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">💳 طرق الدفع المتاحة:</h3>
                <div class="space-y-2 text-xs text-slate-600">
                    <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl"><span>زين كاش:</span> <strong class="text-slate-800">${PAYMENT_INFO.zainCash}</strong></div>
                    <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl"><span>آسيا حوالة:</span> <strong class="text-slate-800">${PAYMENT_INFO.asiaHawala}</strong></div>
                    <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl"><span>بطاقة كي / الماستر:</span> <strong class="text-slate-800">${PAYMENT_INFO.rafidainCard}</strong></div>
                </div>
            </div>

            <!-- نموذج الطلب -->
            <div id="orderFormCard" class="bg-white rounded-3xl p-5 shadow-md border-2 border-blue-500 text-right">
                <h3 class="font-extrabold text-blue-900 mb-4 text-base">📝 استمارة شراء ملزمة</h3>
                <form id="orderForm" onsubmit="submitOrder(event)" class="space-y-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">اسم الطالب الرباعي</label>
                        <input type="text" id="student_name" required placeholder="أدخل اسمك الكامل" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف (الواتساب)</label>
                        <input type="tel" id="phone" required placeholder="07XXXXXXXXX" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">اختر الملزمة</label>
                        <select id="book_title" required class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500">
                            ${booksOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">طريقة الدفع المستخدمة</label>
                        <select id="payment_method" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500">
                            <option value="زين كاش">زين كاش</option>
                            <option value="آسيا حوالة">آسيا حوالة</option>
                            <option value="ماستر كارد / كي كارد">ماستر كارد / كي كارد</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">رقم الحوالة أو رقم العملية</label>
                        <input type="text" id="transaction_ref" required placeholder="أدخل الرقم المرجعي للتحويل" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl transition shadow-sm text-sm mt-2">
                        إرسال الطلب عبر الواتساب 🚀
                    </button>
                </form>
            </div>

            <!-- قائمة الكروت -->
            <div class="pt-2">
                <h3 class="font-bold text-slate-700 mb-3 text-sm">📚 جميع الملازم والكتيبات المتاحة:</h3>
                ${booksCards}
            </div>
        </main>

        <script>
            function selectBook(title) {
                document.getElementById('book_title').value = title;
                document.getElementById('orderFormCard').scrollIntoView({ behavior: 'smooth' });
            }

            async function submitOrder(e) {
                e.preventDefault();
                const student_name = document.getElementById('student_name').value;
                const phone = document.getElementById('phone').value;
                const book_title = document.getElementById('book_title').value;
                const payment_method = document.getElementById('payment_method').value;
                const transaction_ref = document.getElementById('transaction_ref').value;

                // حفظ الطلب في API
                try {
                    await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ student_name, phone, book_title, payment_method, transaction_ref })
                    });
                } catch (err) {}

                // توجيه إلى الواتساب
                const text = encodeURIComponent(
                    \`مرحباً، أود شراء كتاب:\\n📚 الملزمة: \${book_title}\\n👤 الطالب: \${student_name}\\n📞 الهاتف: \${phone}\\n💳 طريقة الدفع: \${payment_method}\\n🔢 رقم الحوالة: \${transaction_ref}\`
                );
                window.open('https://wa.me/${PAYMENT_INFO.whatsappPhone}?text=' + text, '_blank');
            }
        </script>
    </body>
    </html>
  `);
});

module.exports = app;

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`));
}
