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

// واجهة منصة تفوق التعليمية
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>منصة تفوق التعليمية</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
    </head>
    <body class="bg-slate-50 font-['Tajawal'] pb-12">
      <header class="bg-gradient-to-b from-[#1e1b4b] via-[#2e1065] to-[#3b82f6] text-white pt-10 pb-16 px-6 text-center rounded-b-[2.5rem] shadow-xl">
        <div class="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-4 text-blue-600 text-3xl">📚</div>
        <h1 class="text-3xl font-extrabold mb-2">منصة تفوق التعليمية</h1>
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
          <button onclick="alert('طلب فتح الكتاب! يرجى إتمام عملية الدفع.')" class="w-full bg-[#312e81] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md">
            <span>دفع 10,000 د.ع لفتح الكتاب</span> 🔒
          </button>
        </div>
      </main>
    </body>
    </html>
  `);
});

// API يجلب الطلاب من Supabase
app.get('/api/students', async (req, res) => {
  const { data, error } = await supabase.from('students').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = app;
