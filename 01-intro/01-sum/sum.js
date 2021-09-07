function sum(a, b) {
  [a, b]
      .filter((elem) => typeof elem != 'number')
      .forEach((elem) => {
        throw new TypeError(`Argument type is a/an ${typeof elem}, should be a number`);
      });

  return a + b;
}

module.exports = sum;
