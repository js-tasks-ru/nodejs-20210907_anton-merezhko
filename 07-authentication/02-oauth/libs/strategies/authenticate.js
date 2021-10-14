const User = require('../../models/User.js');

module.exports = async function authenticate(
    strategy,
    email,
    displayName,
    done,
) {
  try {
    if (!email) return done(null, false, 'Не указан email');

    const user =
      (await User.findOne({email})) ||
      (await User.create({
        email,
        displayName,
      }));

    done(null, user);
  } catch (err) {
    done(err);
  }
};
