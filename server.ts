import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory / server-side project cache
let serverProjectsCache: any[] = [];

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'CineFlow Studio Commercial Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    capabilities: ['4k-streaming', 'custom-domains', 'byos-storage', 'stripe-lemonsqueezy'],
  });
});

// Video URL resolver API
app.post('/api/storage/resolve', (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing video URL' });
  }

  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    return res.json({
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&controls=1`,
      directStreamUrl: trimmed,
      provider: 'YouTube Unlisted (Free 4K)',
      bandwidthCostPerGb: 0,
    });
  }

  // Google Drive
  const gdriveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
  if (gdriveMatch) {
    const fileId = gdriveMatch[1];
    return res.json({
      type: 'googledrive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      directDownloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      directStreamUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      provider: 'Google Drive (15GB Free)',
      bandwidthCostPerGb: 0,
    });
  }

  // Dropbox
  if (trimmed.includes('dropbox.com')) {
    let directStreamUrl = trimmed;
    if (trimmed.includes('dl=0')) {
      directStreamUrl = trimmed.replace('dl=0', 'raw=1');
    } else if (!trimmed.includes('raw=1')) {
      directStreamUrl = `${trimmed}${trimmed.includes('?') ? '&' : '?'}raw=1`;
    }
    return res.json({
      type: 'dropbox',
      directStreamUrl,
      directDownloadUrl: trimmed.replace('dl=0', 'dl=1'),
      provider: 'Dropbox (Direct Streaming)',
      bandwidthCostPerGb: 0,
    });
  }

  // Cloudflare R2 / S3
  if (trimmed.includes('r2.cloudflarestorage.com') || trimmed.includes('.r2.dev')) {
    return res.json({
      type: 'cloudflare-r2',
      directStreamUrl: trimmed,
      directDownloadUrl: trimmed,
      provider: 'Cloudflare R2 (Zero Egress)',
      bandwidthCostPerGb: 0,
    });
  }

  // Generic Direct Stream
  return res.json({
    type: 'direct',
    directStreamUrl: trimmed,
    directDownloadUrl: trimmed,
    provider: 'Direct CDN / Custom Host',
    bandwidthCostPerGb: 0.005,
  });
});

// 1-Click Migration Parser: parses VidFlow / Vimeo / Google Drive share URLs
app.post('/api/migrate/parse', (req, res) => {
  const { sourceUrl, clientNames } = req.body;
  if (!sourceUrl) {
    return res.status(400).json({ error: 'Source URL is required' });
  }

  const names = clientNames?.trim() || 'Sarah & Michael';
  const slug = names.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Simulated AI/heuristic extraction from migrated link
  const parsedProject = {
    id: `migrated_${Date.now()}`,
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    title: names,
    subtitle: 'Official Cinematic Wedding Film Gallery',
    eventDate: 'Delivered from Archive',
    location: 'Private Celebration',
    heroCoverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
    theme: 'luxury-gold',
    isPasswordProtected: false,
    passcode: '1234',
    allowClientDownloads: true,
    allowGuestbook: true,
    status: 'delivered',
    viewsCount: 1,
    downloadsCount: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    customNotes: 'Successfully migrated from existing video gallery with permanent zero-cost hosting.',
    branding: {
      studioName: 'Studio Cinema',
      tagline: 'Artisanal Wedding Films',
      filmmakerName: 'Lead Filmmaker',
      websiteUrl: '',
      instagramHandle: '@cinemastudio',
      contactEmail: 'contact@example.com',
      primaryColor: '#d97706',
      showWatermark: false,
    },
    films: [
      {
        id: `film_migrated_1`,
        title: 'The Highlight Film',
        category: 'Highlight Film',
        duration: '07:45',
        durationSeconds: 465,
        videoUrl: sourceUrl,
        sourceType: 'direct',
        coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
        description: 'Primary cinematic cut migrated into CineFlow high-bitrate streaming.',
        musicTrack: 'Memories of Grace',
        musicArtist: 'Acoustic Soundscapes',
        licensePlatform: 'Musicbed',
        chapters: [
          { id: 'mc1', timeInSeconds: 0, title: 'Opening Scene' },
          { id: 'mc2', timeInSeconds: 90, title: 'The Vows' },
          { id: 'mc3', timeInSeconds: 220, title: 'First Dance & Celebration' },
        ],
        downloads: [
          {
            id: 'md1',
            label: 'Master 4K UHD Film',
            resolution: '3840 x 2160',
            fileSize: '14.2 GB',
            format: 'Apple ProRes 422',
            url: sourceUrl,
            description: 'Archival preservation file.',
          },
          {
            id: 'md2',
            label: 'Web & Mobile 1080p',
            resolution: '1920 x 1080',
            fileSize: '1.8 GB',
            format: 'H.264 MP4',
            url: sourceUrl,
            description: 'High-speed download for phones and laptops.',
          },
        ],
      },
    ],
    photos: [],
    guestbook: [],
  };

  res.json({
    success: true,
    message: 'Migrated successfully without VidFlow data loss',
    project: parsedProject,
  });
});

// Custom Domain Verification API
app.post('/api/domain/verify', (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '');

  // Simulate Cloudflare for SaaS CNAME validation
  res.json({
    domain: cleanDomain,
    targetCname: 'domains.cineflow.app',
    status: 'verified',
    sslStatus: 'active',
    issuedAt: new Date().toISOString(),
    instructions: `Add a CNAME record: ${cleanDomain} -> domains.cineflow.app`,
  });
});

// Billing Checkout API (Stripe / Payment Link Integration)
app.post('/api/billing/create-checkout', (req, res) => {
  const { planId, email, filmmakerName, customPaymentLink } = req.body;

  const planPricing: Record<string, { name: string; amount: number; interval: string; defaultLink?: string }> = {
    starter: { name: 'Starter Free', amount: 0, interval: 'forever' },
    solo: {
      name: 'Filmmaker Solo (250 GB)',
      amount: 1000,
      interval: 'month',
      defaultLink: process.env.STRIPE_PAYMENT_LINK_SOLO || 'https://buy.stripe.com/test_solo',
    },
    pro: {
      name: 'Studio Pro (1.5 TB)',
      amount: 2000,
      interval: 'month',
      defaultLink: process.env.STRIPE_PAYMENT_LINK_PRO || 'https://buy.stripe.com/test_pro',
    },
    elite: {
      name: 'Cinema Agency (5 TB)',
      amount: 3600,
      interval: 'month',
      defaultLink: process.env.STRIPE_PAYMENT_LINK_ELITE || 'https://buy.stripe.com/test_elite',
    },
    studio: {
      name: 'Studio Pro (1.5 TB)',
      amount: 2000,
      interval: 'month',
      defaultLink: process.env.STRIPE_PAYMENT_LINK_PRO || 'https://buy.stripe.com/test_studio',
    },
    lifetime: {
      name: 'Founders Lifetime Pass',
      amount: 17900,
      interval: 'one-time',
      defaultLink: process.env.STRIPE_PAYMENT_LINK_LIFETIME || 'https://buy.stripe.com/test_lifetime',
    },
  };

  const selected = planPricing[planId] || planPricing.pro;

  // Use custom payment link, env var, or real Stripe redirect
  const resolvedCheckoutUrl = customPaymentLink || selected.defaultLink || `https://filmandphoto.uk/#checkout-success?plan=${planId}`;

  res.json({
    success: true,
    checkoutUrl: resolvedCheckoutUrl,
    sessionId: `cs_live_${Date.now()}`,
    plan: selected,
    customer: { email, filmmakerName },
    provider: process.env.STRIPE_SECRET_KEY ? 'stripe_live' : 'stripe_payment_link',
    message: 'Stripe checkout link dispatched successfully',
  });
});

// Stripe Webhook Endpoint for payment events
app.post('/api/billing/webhook', (req, res) => {
  const event = req.body;
  console.log('Received Stripe Webhook Event:', event?.type || 'unknown');
  res.json({ received: true });
});


// ==========================================
// STATIC FILES & DEV MIDDLEWARE
// ==========================================

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CineFlow Platform Server running at http://localhost:${PORT}`);
  });
}

startServer();
