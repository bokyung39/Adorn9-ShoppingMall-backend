const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, OAuth } = require('../../models');

const config = {
  clientID: "190783355750-bnc5idqlfhchjqeppo6q48nmg704rdas.apps.googleusercontent.com",// clientId 설정하기
  clientSecret: "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",// clientSecret 설정하기
  callbackURL: "http://localhost:3000/api/v1/users/google/callback"
};

async function findOrCreateUser({ name, email, address, phone_number, user_name}) {
  const user = await User.findOne({
    email,
  });

  if (user) { 
    return user;
  }

  const created = await User.create({
    name,
    email,
    address,
    phone_number,
    user_name,
    password: 'GOOGLE_OAUTH',
  });

  return created;
}

module.exports = new GoogleStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const { email, name } = profile._json;

  try {
    const user = await findOrCreateUser({ email, name })
    done(null, {
      shortId: user.shortId,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    done(e, null);
  }
});