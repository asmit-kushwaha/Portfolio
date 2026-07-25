const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Trust reverse proxy for Render (needed for rate limiter and IP detection)
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'https://asmitkushwaha.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS rejected origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// Routes
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
