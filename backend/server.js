const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Render (and most hosting platforms) run behind a reverse proxy.
// This tells Express to trust the X-Forwarded-For header from that one proxy layer,
// which express-rate-limit needs to correctly identify real client IPs.
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
      // Log which origin got rejected, without throwing — avoids flooding
      // logs with full stack traces on every bot/scanner request.
      console.log('CORS rejected origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

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
