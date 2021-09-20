const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const pathDepth = pathname.split(path.sep).length;
  const filepath = path.join(__dirname, 'files', pathname);

  function sendResponse(statusCode, message) {
    res.statusCode = statusCode;
    res.end(message);
  }

  if (pathDepth > 1) {
    sendResponse(400, 'Bad request');

    return;
  }

  switch (req.method) {
    case 'GET':
      const readStream = fs.createReadStream(filepath);

      readStream.pipe(res);

      readStream.on('error', (error) => {
        error.code === 'ENOENT' ?
          sendResponse(404, 'File not found') :
          sendResponse(500, 'Internal server error');
      });
      break;
    default:
      sendResponse(501, 'Not implemented');
  }
});

module.exports = server;
