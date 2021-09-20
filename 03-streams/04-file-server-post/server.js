const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
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
    case 'POST':
      const limitedWriteStream = new LimitSizeStream({limit: 1e6});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(limitedWriteStream).pipe(writeStream);

      req.on('data', (data) => {
        writeStream.write(data);
      });
      req.on('aborted', () => {
        writeStream.destroy();
        removeFile(filepath);
      });

      limitedWriteStream.on('error', (error) => {
        error.code === 'LIMIT_EXCEEDED' ?
          sendResponse(413, 'File size exceeded 1MB') :
          sendResponse(500, 'Internal server error');

        writeStream.destroy();
        removeFile(filepath);
      });

      writeStream.on('error', (error) => {
        error.code === 'EEXIST' ?
          sendResponse(409, 'File already exists') :
          sendResponse(500, 'Internal server error');
      });
      writeStream.on('finish', () => {
        sendResponse(201, 'File saved');
      });
      break;
    default:
      sendResponse(501, 'Not implemented');
  }
});

function removeFile(filepath) {
  fs.unlink(filepath, (err) => {
    const logMessage = err ? `Failed to remove file` :`Sucessfully removed file ${filepath}`;
    console.log(logMessage);
  });
}

module.exports = server;
