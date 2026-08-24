const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// اختبار السيرفر
app.get("/", (req, res) => {
  res.json({
    message: "Talabe Backend is Running",
    status: "OK"
  });
});

// جلب المواد
app.get("/subjects", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("*");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// جلب الملازم والملفات
app.get("/files", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("files")
      .select("*");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// إضافة طالب
app.post("/students", async (req, res) => {

  try {

    const { name, phone } = req.body;

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: name,
          phone: phone
        }
      ])
      .select();

    if (error) throw error;

    res.json(data);

  } catch(error){

    res.status(500).json({
      error: error.message
    });

  }

});


// مهم لـ Vercel
module.exports = app;
