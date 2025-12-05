import express from 'express';
import cors from 'cors';
import { requireAuth } from './middleware/auth.js';
import foodLogsRouter from './routes/foodLogs.js';
import foodsRouter from './routes/foods.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';

/**
 * Entrypoint utama server Express untuk backend Piring Sehat.
 *
 * Tanggung jawab file ini:
 * - Menginisialisasi instance Express dan middleware global (CORS, JSON parsing, logging sederhana).
 * - Mendaftarkan semua router utama di bawah prefix `/api`.
 * - Menerapkan proteksi autentikasi Firebase pada route tertentu.
 * - Menyediakan handler 404 khusus untuk endpoint `/api/*` dan error handler global.
 */
const app = express();
const port = process.env.PORT || 3000;

// Konfigurasi CORS: izinkan hanya origin tertentu (dev + produksi)
const allowedOrigins = [
  'http://localhost:5173',
  'https://piring-sehat.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      // Request tanpa origin (misal dari server ke server) diizinkan
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Logging sederhana untuk semua request
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

app.get('/', (req, res) => {
  res.send('Server berjalan!');
});

// Proteksi food-logs dan users dengan Firebase Auth
app.use('/api/food-logs', requireAuth, foodLogsRouter);
app.use('/api/users', requireAuth, usersRouter);

// Foods dan auth (sync user) tidak butuh auth untuk saat ini
app.use('/api/foods', foodsRouter);
app.use('/api/auth', authRouter);

// 404 handler untuk route yang tidak dikenal
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint tidak ditemukan' });
  }
  next();
});

// Error handler global
// Pastikan semua error yang tidak tertangani tetap mengirim respon JSON standar
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Terjadi kesalahan di server' });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});