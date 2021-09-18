const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const pathDepth = pathname.split(path.sep).length;
  const filepath = path.join(__dirname, 'files', pathname);


  if (pathDepth > 1) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  switch (req.method) {
    case 'GET':
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);

      readStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
          return;
        }
        res.statusCode = 500;
        res.end('Internal server error');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
