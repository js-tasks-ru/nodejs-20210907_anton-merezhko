function sum(a, b) {
  if (typeof a != 'number' || typeof b != 'number') {
    throw new TypeError('argument is not a number');
  }

  return a + b;
}

module.exports = sum;
