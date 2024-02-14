const passport = require('passport');
const AuthStrat = require('passport-google-oauth2').Strategy;

const {googleClientID, googleClientSecret} = require("../config/dev")
(console.log(googleClientID, googleClientSecret));

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.example.com/oauth2/authorize',
    tokenURL: 'https://www.example.com/oauth2/token',
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: "http://localhost:3001/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return cb(err, profile)
  }
));

passport.serializeUser(function(user, done) {
    done(null, user)
});

passport.deserializeUser(function(user, done) {
    done(null, user)
});