import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to proxy and fetch Google Sheets CSV without CORS restrictions
app.get('/api/sync-sheet', async (req: Request, res: Response) => {
  const samplePath = path.join(__dirname, 'public', 'assets', 'aistudio', 'Dashboard___d47ebf60');
  let fallbackCsv = '';
  if (fs.existsSync(samplePath)) {
    fallbackCsv = fs.readFileSync(samplePath, 'utf-8');
  }

  try {
    const rawUrl = (req.query.url as string) || '';
    const sheetTab = (req.query.sheet as string) || '';

    // If no URL or placeholder/dummy URL, serve default data directly
    const isPlaceholder = !rawUrl.trim() || rawUrl.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms') || rawUrl.includes('MY_APP_URL');

    if (isPlaceholder) {
      if (fallbackCsv) {
        return res.json({ success: true, csv: fallbackCsv, source: 'default_attachment' });
      }
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    let fetchUrl = rawUrl.trim();

    // Check if it's already a direct CSV URL
    const isDirectCsv = fetchUrl.includes('output=csv') || fetchUrl.includes('format=csv') || fetchUrl.endsWith('.csv');

    if (!isDirectCsv) {
      // Extract Google Spreadsheet ID
      const sheetIdMatch = fetchUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
      const gidMatch = fetchUrl.match(/[#&?]gid=([0-9]+)/);

      if (sheetIdMatch && sheetIdMatch[1]) {
        const sheetId = sheetIdMatch[1];
        if (sheetTab) {
          // Fetch specific tab by name using Google visualization API export
          fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetTab)}`;
        } else if (gidMatch && gidMatch[1]) {
          fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gidMatch[1]}`;
        } else {
          fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        }
      }
    }

    // Fetch the CSV from Google
    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/csv,text/plain,*/*'
      }
    });

    if (!response.ok) {
      return res.status(200).json({
        success: false,
        error: `Google Sheets แจ้งสถานะ HTTP ${response.status} (${response.statusText}): กรุณาเปิดสิทธิ์แชร์ชีตเป็น "ทุกคนที่มีลิงก์ (Anyone with the link can view)"`,
        isUnauthorized: response.status === 401 || response.status === 403,
        fallbackCsv,
        source: 'cached_fallback'
      });
    }

    const csvText = await response.text();

    // Quick verification: Google HTML login page returned instead of CSV
    if (csvText.includes('<!DOCTYPE html>') && (csvText.includes('accounts.google.com') || csvText.includes('ServiceLogin'))) {
      return res.status(200).json({
        success: false,
        error: 'Google Sheet เป็นแบบส่วนตัว (Private): กรุณาคลิก "แชร์" -> "ทุกคนที่มีลิงก์อ่านได้" หรือ "เผยแพร่ไปยังเว็บ (Publish to web) เป็น CSV"',
        isUnauthorized: true,
        fallbackCsv,
        source: 'cached_fallback'
      });
    }

    return res.json({
      success: true,
      csv: csvText,
      fetchedUrl: fetchUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(200).json({
      success: false,
      error: error.message || 'Failed to fetch Google Sheet data',
      fallbackCsv,
      source: 'cached_fallback'
    });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
