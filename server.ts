import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple in-memory rate limiting to protect the server when deployed without an external firewall
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 req/min

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Terlalu banyak permintaan. Silakan tunggu 1 menit.',
    });
  }

  clientData.count += 1;
  next();
}

// Periodic cleanup of stale rate-limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

async function startServer() {
  const app = express();

  // Hide Express signature
  app.disable('x-powered-by');

  // Hardened Security Headers (Protects deployment when no external WAF/firewall exists)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // Limit body payload to prevent memory exhaustion
  app.use(express.json({ limit: '50kb' }));

  // Initialize Gemini if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Backend endpoint: AI Tool Advisor (Rate-limited, sanitized)
  app.post('/api/advisor', rateLimiter, async (req, res) => {
    try {
      const { query, hardware, goal } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Sanitize input length
      const cleanQuery = query.slice(0, 500).trim();
      const cleanHardware = typeof hardware === 'string' ? hardware.slice(0, 100).trim() : 'Standar / Bebas';
      const cleanGoal = typeof goal === 'string' ? goal.slice(0, 100).trim() : 'Efisiensi Biaya Rp0';

      if (!ai) {
        // Fallback response if key is not configured
        return res.json({
          recommendation: `Berdasarkan kebutuhan "${cleanQuery}", kami merekomendasikan kombo: 1. Model lokal via Ollama untuk inferensi teks gratis, 2. Whisper.cpp untuk audio/transkrip, dan 3. n8n untuk otomatisasi. Semua dapat dijalankan dengan budget Rp0.`,
          steps: [
            'Langkah 1: Identifikasi input data mentah Anda.',
            'Langkah 2: Gunakan tool open-source yang sesuai dari katalog Radar AI.',
            'Langkah 3: Rangkai ke dalam Pipeline untuk otomatisasi rutin.',
          ],
          source: 'local-fallback',
        });
      }

      const prompt = `Anda adalah konsultan ahli AI gratis dan open-source dari RADAR AI.
Pengguna membutuhkan solusi AI dengan kendala:
- Masalah/Tujuan: "${cleanQuery}"
- Spesifikasi Perangkat: "${cleanHardware}"
- Fokus: "${cleanGoal}"

Berikan saran ringkas dalam bahasa Indonesia (maksimal 3 paragraf pendek):
1. Tool terbaik yang direkomendasikan dari ekosistem open-source/free (misal Whisper, FLUX.1, Ollama, n8n, NotebookLM, DeepSeek, DuckDB, dll).
2. Urutan 3 langkah eksekusi konkret.
3. Tips hemat kuota dan spesifikasi komputer.
Gaya bicara: praktis, to the point, optimis, tanpa jargon rumit.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        recommendation: response.text || 'Tidak ada rekomendasi.',
        source: 'gemini-3.8-flash',
      });
    } catch (_err: any) {
      // Secure error handling: Never leak internal error stacks or API details to client
      return res.status(500).json({
        error: 'Layanan konsultasi AI sedang sibuk. Silakan coba kembali sesaat lagi.',
        fallback: 'Gunakan filter kategori di katalog Radar AI untuk menemukan tool yang tepat secara mandiri.',
      });
    }
  });

  // Backend endpoint: Safe Sandbox Run (Rate-limited, sanitized)
  app.post('/api/sandbox', rateLimiter, async (req, res) => {
    try {
      const { prompt, model } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const cleanPrompt = prompt.slice(0, 1000).trim();

      if (!ai) {
        return res.json({
          output: `[Mode Simulasi Standar]: Prompt "${cleanPrompt.slice(0, 50)}..." berhasil dievaluasi. Untuk eksekusi live tanpa biaya langganan, Anda dapat menjalankan model lokal via Ollama atau memakai free tier OpenRouter.`,
          model: model || 'gemini-3.8-flash',
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: cleanPrompt,
      });

      return res.json({
        output: response.text || 'Tidak ada output yang dihasilkan.',
        model: 'gemini-3.8-flash',
      });
    } catch (_err: any) {
      return res.status(500).json({
        error: 'Layanan sandbox sedang sibuk. Silakan gunakan model lokal via Ollama atau coba lagi.',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Setup Vite middleware in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
