const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.cache = '';
  }

  _transform(chunk, encoding, callback) {
    const text = this.cache + chunk.toString('utf-8');

    if (text.includes(os.EOL)) {
      const lines = text.split(os.EOL);
      this.cache = lines.pop();

      lines.forEach((line) => this.push(line));
    } else {
      this.cache = text;
    }
    callback();
  }

  _flush(callback) {
    if (this.cache) {
      this.push(this.cache);
    }
    callback();
  }
}

module.exports = LineSplitStream;
