require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/certificate', require('./routes/certificateRoutes'));

app.get('/', (req, res) => {
  res.send('API is running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});