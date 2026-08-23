const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات باستخدام متغير البيئة DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// المسار الرئيسي (عرض الواجهة الأمامية والاتصال بقاعدة البيانات مباشرة)
app.get('/', async (req, res) => {
  try {
    // محاولة جلب الكتب من قاعدة البيانات
    const result = await pool.query('SELECT * FROM books');
    const booksFromDB = result.rows;

    // إذا لم تكن هناك كتب في جدول قاعدة البيانات بعد، نعرض كتب تجريبية افتراضية
    const books = booksFromDB.length > 0 ? booksFromDB : [
      { title: "الاجتماعيات - ثالث متوسط", description: "مراجعة شاملة لأسئلة التاريخ والجغرافيا والوطنية.", price: "مجاني" },
      { title: "اللغة العربية", description: "قواعد وأدب للصف الثالث المتوسط.", price: "مفعل" },
      { title: "الرياضيات الجزء الأول", description: "شرح مبسط للأمثلة والتمارين.", price: "اشتراك" }
    ];

    // إرجاع واجهة HTML أنيقة للمستخدم
    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>منصة طلبي - Talabe</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
          <style> body { font-family: 'Cairo', sans-serif; } </style>
      </head>
      <body class="bg-slate-50 min-h-screen flex flex-col justify-between">
          <header class="bg-indigo-600 text-white shadow-md">
              <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                  <h1 class="text-xl font-bold">📚 منصة طلبي التعليمية</h1>
                  <span class="text-xs bg-emerald-500 px-3 py-1 rounded-full">السيرفر وقاعدة البيانات متصلة 🟢</span>
              </div>
          </header>
          <main class="container mx-auto px-4 py-8 flex-grow">
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 text-center">
                  <h2 class="text-2xl font-bold text-slate-800 mb-2">مرحباً بك في تطبيق طلبي</h2>
                  <p class="text-slate-600">تصفح المناهج والكتب الدراسية بكل سهولة واشترك الآن للبدء.</p>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-4">الكتب الدراسية المتاحة</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  ${books.map(book => `
                      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                          <div>
                              <h4 class="font-bold text-lg text-slate-800 mb-1">${book.title}</h4>
                              <p class="text-sm text-slate-600 mb-4">${book.description || ''}</p>
                          </div>
                          <button onclick="alert('تم اختيار الكتاب بنجاح!')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition">
                              عرض الكتاب (${book.price || 'متاح'})
                          </button>
                      </div>
                  `).join('')}
              </div>
          </main>
          <footer class="bg-white border-t border-slate-200 py-4 text-center text-sm text-slate-500">
              جميع الحقوق محفوظة &copy; 2026 - تطبيق طلبي
          </footer>
      </body>
      </html>
    `);
  } catch (err) {
    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>منصة طلبي - Talabe</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
          <style> body { font-family: 'Cairo', sans-serif; } </style>
      </head>
      <body class="bg-slate-50 min-h-screen flex flex-col justify-between">
          <header class="bg-indigo-600 text-white shadow-md">
              <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                  <h1 class="text-xl font-bold">📚 منصة طلبي التعليمية</h1>
                  <span class="text-xs bg-amber-500 px-3 py-1 rounded-full">السيرفر يعمل 🟡</span>
              </div>
          </header>
          <main class="container mx-auto px-4 py-8 flex-grow">
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 text-center">
                  <h2 class="text-2xl font-bold text-slate-800 mb-2">مرحباً بك في تطبيق طلبي</h2>
                  <p class="text-slate-600">السيرفر يعمل بشكل ممتاز، وفي انتظار إعداد جدول الكتب في قاعدة البيانات.</p>
              </div>
          </main>
          <footer class="bg-white border-t border-slate-200 py-4 text-center text-sm text-slate-500">
              جميع الحقوق محفوظة &copy; 2026 - تطبيق طلبي
          </footer>
      </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
