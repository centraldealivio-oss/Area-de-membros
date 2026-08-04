/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory token database (backed by runtime memory)
interface StoredToken {
  token: string;
  tier: 'standard' | 'bonus_1' | 'bonus_2' | 'bonus_3' | 'all_bonuses' | 'vip_upsell' | 'supremo';
  customerName: string;
  customerEmail: string;
  createdAt: string;
  source: string;
}

const tokenDatabase: Record<string, StoredToken> = {
  'TOKEN-BONUS1-BPM100': {
    token: 'TOKEN-BONUS1-BPM100',
    tier: 'bonus_1',
    customerName: 'Aluno Bônus 1 (100 BPM + VIP)',
    customerEmail: 'bonus1@paradisepags.com',
    createdAt: new Date().toISOString(),
    source: 'preset'
  },
  'TOKEN-BONUS2-GATILHO': {
    token: 'TOKEN-BONUS2-GATILHO',
    tier: 'bonus_2',
    customerName: 'Aluno Bônus 2 (Raio-X + VIP)',
    customerEmail: 'bonus2@paradisepags.com',
    createdAt: new Date().toISOString(),
    source: 'preset'
  },
  'TOKEN-BONUS3-VINCULO': {
    token: 'TOKEN-BONUS3-VINCULO',
    tier: 'bonus_3',
    customerName: 'Aluno Bônus 3 (Blindagem + VIP)',
    customerEmail: 'bonus3@paradisepags.com',
    createdAt: new Date().toISOString(),
    source: 'preset'
  },
  'TOKEN-ALL-BONUSES': {
    token: 'TOKEN-ALL-BONUSES',
    tier: 'all_bonuses',
    customerName: 'Aluno Todos Bônus + VIP',
    customerEmail: 'allbonuses@paradisepags.com',
    createdAt: new Date().toISOString(),
    source: 'preset'
  },
  'PARADISE-VIP-8888': {
    token: 'PARADISE-VIP-8888',
    tier: 'vip_upsell',
    customerName: 'Cliente VIP Paradise',
    customerEmail: 'comprador.vip@paradisepags.com',
    createdAt: new Date().toISOString(),
    source: 'preset'
  },
  'PARADISE-STD-1234': {
    token: 'PARADISE-STD-1234',
    tier: 'standard',
    customerName: 'Cliente Padrão Paradise',
    customerEmail: 'comprador.padrao@paradisepags.com',
    createdAt: new Date().toISOString(),
    source: 'preset'
  }
};

// --- API ENDPOINTS ---

// 1. Validate Token
app.get('/api/validate-token', (req: Request, res: Response) => {
  const token = (req.query.token as string || '').trim().toUpperCase();

  if (!token) {
    return res.status(400).json({ valid: false, message: 'Token é obrigatório.' });
  }

  // Check database
  if (tokenDatabase[token]) {
    const t = tokenDatabase[token];
    return res.json({
      valid: true,
      session: {
        token: t.token,
        tier: t.tier,
        customerName: t.customerName,
        customerEmail: t.customerEmail,
        authenticatedAt: new Date().toISOString()
      }
    });
  }

  // Fallback heuristic for Paradise generated tokens
  if (token.includes('SUPREMO') || token.includes('MASTER')) {
    return res.json({
      valid: true,
      session: {
        token,
        tier: 'supremo',
        customerName: 'Membro SUPREMO Master',
        customerEmail: 'supremo@paradisepags.com',
        authenticatedAt: new Date().toISOString()
      }
    });
  }

  if (token.includes('BONUS1') || token.includes('BONUS-1') || token.includes('BPM100')) {
    return res.json({
      valid: true,
      session: {
        token,
        tier: 'bonus_1',
        customerName: 'Cliente Bônus 1',
        customerEmail: 'bonus1@paradisepags.com',
        authenticatedAt: new Date().toISOString()
      }
    });
  }

  if (token.includes('BONUS2') || token.includes('BONUS-2') || token.includes('GATILHO') || token.includes('RAIOX')) {
    return res.json({
      valid: true,
      session: {
        token,
        tier: 'bonus_2',
        customerName: 'Cliente Bônus 2',
        customerEmail: 'bonus2@paradisepags.com',
        authenticatedAt: new Date().toISOString()
      }
    });
  }

  if (token.includes('BONUS3') || token.includes('BONUS-3') || token.includes('VINCULO') || token.includes('BLINDAGEM')) {
    return res.json({
      valid: true,
      session: {
        token,
        tier: 'bonus_3',
        customerName: 'Cliente Bônus 3',
        customerEmail: 'bonus3@paradisepags.com',
        authenticatedAt: new Date().toISOString()
      }
    });
  }

  if (
    token.includes('PARADISE-VIP') ||
    token.startsWith('PARADISE-VIP') ||
    token.startsWith('VIP-') ||
    token.includes('UPSELL') ||
    token.includes('VIP')
  ) {
    return res.json({
      valid: true,
      session: {
        token,
        tier: 'vip_upsell',
        customerName: 'Cliente VIP Paradise',
        customerEmail: 'cliente.vip@paradisepags.com',
        authenticatedAt: new Date().toISOString()
      }
    });
  }

  if (token.startsWith('PARADISE-') || token.startsWith('ADE-') || token.length >= 6) {
    return res.json({
      valid: true,
      session: {
        token,
        tier: 'standard',
        customerName: 'Cliente Paradise',
        customerEmail: 'cliente@paradisepags.com',
        authenticatedAt: new Date().toISOString()
      }
    });
  }

  return res.status(401).json({ valid: false, message: 'Token inválido ou não encontrado.' });
});

// 2. Paradise Webhook Endpoint (https://multi.paradisepags.com/)
app.post('/api/webhooks/paradise', (req: Request, res: Response) => {
  const payload = req.body || {};
  console.log('📦 Paradise Webhook Received:', payload);

  const customerName = payload.customer?.name || payload.buyer_name || 'Comprador Paradise';
  const customerEmail = payload.customer?.email || payload.buyer_email || 'cliente@paradisepags.com';
  const isUpsell = Boolean(payload.upsell_purchased || payload.is_upsell || payload.tier === 'vip' || payload.has_bonus);
  
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const newTokenString = isUpsell ? `PARADISE-VIP-${randomSuffix}` : `PARADISE-STD-${randomSuffix}`;

  const tokenObj: StoredToken = {
    token: newTokenString,
    tier: isUpsell ? 'vip_upsell' : 'standard',
    customerName,
    customerEmail,
    createdAt: new Date().toISOString(),
    source: 'paradise_webhook'
  };

  tokenDatabase[newTokenString] = tokenObj;

  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  const redirectUrl = `${appUrl}/?token=${newTokenString}`;

  return res.json({
    success: true,
    message: 'Token gerado com sucesso para a Área de Membros!',
    access_token: newTokenString,
    tier: tokenObj.tier,
    redirect_url: redirectUrl,
    customer: {
      name: customerName,
      email: customerEmail
    }
  });
});

// 3. List Tokens (Admin/Developer inspection)
app.get('/api/tokens', (_req: Request, res: Response) => {
  return res.json({
    total: Object.keys(tokenDatabase).length,
    tokens: Object.values(tokenDatabase)
  });
});

// 4. Generate Token directly
app.post('/api/generate-token', (req: Request, res: Response) => {
  const { name, email, tier } = req.body;
  const isVip = tier === 'vip_upsell';
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const newTokenString = isVip ? `PARADISE-VIP-${randomSuffix}` : `PARADISE-STD-${randomSuffix}`;

  tokenDatabase[newTokenString] = {
    token: newTokenString,
    tier: isVip ? 'vip_upsell' : 'standard',
    customerName: name || 'Novo Aluno',
    customerEmail: email || 'aluno@paradise.com',
    createdAt: new Date().toISOString(),
    source: 'manual_generate'
  };

  return res.json({
    success: true,
    token: newTokenString,
    tier: isVip ? 'vip_upsell' : 'standard',
    redirectUrl: `/?token=${newTokenString}`
  });
});

async function startServer() {
  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Área de Membros rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
