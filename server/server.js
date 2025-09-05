const express = require('express');
const app = express();
const port = 3001; // متفاوت از پورت فرانت‌اند (معمولاً 5173 برای Vite)

app.use(express.json()); // برای پارسینگ JSON

// نمونه روت برای API
app.get('/api/data', (req, res) => {
  res.json({ message: 'Data from backend', data: [1, 2, 3] }); // داده برای Recharts
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});