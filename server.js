// جلب الملازم من Supabase
app.get('/api/books', async (req, res) => {
  const { data, error } = await supabase.from('books').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
