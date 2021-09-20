const http = require('http');
const path = require('path');
const server = new http.Server();
const fs = require('fs');

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
    case 'DELETE':
      fs.unlink(filepath, (error) => {
        !error ?
          sendResponse(200, `Sucessfully deleted ${filepath}`):
          error.code === 'ENOENT' ?
            sendResponse(404, 'File not found') :
            sendResponse(500, 'Bad request');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
