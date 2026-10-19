'use strict';
// Servidor mínimo para servir los archivos estáticos del frontend (html, css, js).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = __dirname;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

const log = (tag, ...a) => console.log(`[${tag}]`, new Date().toISOString(), ...a);

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  // Evita salir de la carpeta del proyecto (../../etc)
  const safePath = path.normalize(path.join(ROOT, reqPath));
  if (!safePath.startsWith(ROOT)) {
    res.writeHead(400); return res.end('Ruta inválida');
  }

  fs.readFile(safePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('No encontrado');
    }
    const ext = path.extname(safePath);
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

process.on('uncaughtException', (e) => log('error', 'uncaughtException', e.stack || e));

server.listen(PORT, '0.0.0.0', () => log('sistema', `frontend escuchando en ${PORT}`));