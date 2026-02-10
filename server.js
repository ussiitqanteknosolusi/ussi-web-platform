const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Konfigurasi Environment
const dev = process.env.NODE_ENV !== 'production';
const hostname = '127.0.0.1'; // Kita paksa ke localhost agar lebih stabil di Hostinger
const port = process.env.PORT || 3000;

// Inisialisasi Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Handle request standard Next.js
      await handle(req, res, parsedUrl);
      
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
