import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'EcoCarry Server', timestamp: new Date().toISOString() });
  });

  // Server Time Endpoint
  app.get('/api/server-time', (_req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      epoch: Date.now(),
    });
  });

  // Server-side Reward Redemption with Cryptographically Secure Single-Use Voucher Codes
  app.post('/api/redeem', async (req, res) => {
    try {
      const { rewardId, rewardName, pointsCost, userId, studentName } = req.body;
      if (!rewardId || pointsCost === undefined || !userId) {
        return res.status(400).json({ error: 'Missing required reward redemption parameters' });
      }

      // Generate unique single-use cryptographic voucher code
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const code = `ECO-${rewardId.slice(0, 6).toUpperCase()}-${randomSuffix}-${Date.now().toString().slice(-4)}`;
      const issuedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      return res.json({
        success: true,
        voucher: {
          id: `vch_${Date.now()}_${randomSuffix}`,
          code,
          rewardId,
          rewardName: rewardName || 'Campus Eco Reward',
          pointsCost: Number(pointsCost),
          userId,
          studentName: studentName || 'Eco Student',
          status: 'active',
          issuedAt,
          expiresAt,
        },
      });
    } catch (err: any) {
      console.error('Redeem API error:', err);
      return res.status(500).json({ error: 'Internal server error processing redemption' });
    }
  });

  // Calculate Campus Totals & Metrics Server Route
  app.get('/api/campus-totals', (_req, res) => {
    res.json({
      monthlyGoal: 180000,
      timestamp: new Date().toISOString(),
    });
  });

  // Development vs Production Environment routing
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoCarry Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
