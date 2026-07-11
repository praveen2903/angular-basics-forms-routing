const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  const server = jsonServer.create();

  // Copy db.json to /tmp (writable area on Vercel)
  const dbPath = path.join('/tmp', 'db.json');
  if (!fs.existsSync(dbPath)) {
    const sourceDb = path.join(process.cwd(), 'db.json');
    fs.copyFileSync(sourceDb, dbPath);
  }

  const router = jsonServer.router(dbPath);
  const middlewares = jsonServer.defaults({ noCors: true });

  server.use(cors());
  server.use(middlewares);

  // Rewrite /api/* to /* so json-server routes work correctly
  server.use((req, res, next) => {
    req.url = req.url.replace(/^\/api/, '');
    next();
  });

  server.use(router);
  server(req, res);
};
