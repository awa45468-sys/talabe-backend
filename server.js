const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بـ Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// واجهة تطبيق طلبتي الرئيسية
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تطبيق طلبتي</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
    </head>
    <body class="bg-slate-50 font-['Tajawal'] pb-12">
        <header class="bg-gradient-to-b from-[#1e1b4b] via-[#2b02f6] to-[#3b02f6] text-white pt-10 pb-16 px-6 text-center">
            <div class="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
            <h1 class="text-3xl font-extrabold mb-2">تطبيق طلبتي</h1>
            <p class="text-slate-200 text-sm max-w-md mx-auto">المتجر الرسمي للملازم والمرشحات الوزارية — فتح أي كتاب بـ 10,000 دينار فقط</p>
        </header>

        <main class="max-w-md mx-auto px-4 -mt-8 space-y-4">
            <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                <div class="flex items-center justify-between mb-3">
                    <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">🏷️ 10,000 د.ع</span>
                    <span class="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">اجتماعيات</span>
                </div>
                <h2 class="text-lg font-bold text-slate-800 mb-2">الملزمة الشاملة للاجتماعيات الوزارية</h2>
                <p class="text-xs text-slate-500 mb-4">تتضمن التاريخ، الجغرافيا، والوطنية مع حلول جميع التعاليل والخرائط والتعاريف.</p>
                <button onclick="alert('يرجى الدفع لفتح الكتاب')" class="w-full bg-[#212e81] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
                    <span>دفع 10,000 د.ع لفتح الكتاب</span> 🔒
                </button>
            </div>
        </main>
    </body>
    </html>
  `);
});

// API يجلب الملازم من Supabase
app.get('/api/books', async (req, res) => {
  const { data, error } = await supabase.from('books').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = app;
