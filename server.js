const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// اتصال Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// اختبار الاتصال
app.get("/", (req, res) => {
  res.json({
    status: "Talabe Backend Running",
    supabase: "Connected"
  });
});

// جلب المواد
app.get("/subjects", async (req, res) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

// جلب الملفات والملازم
app.get("/files", async (req, res) => {
  const { data, error } = await supabase
    .from("files")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

// تسجيل طالب
app.post("/students", async (req, res) => {
  const { name, phone } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        phone
      }
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Talabe Backend running on ${PORT}`);
});
