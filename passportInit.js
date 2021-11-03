const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  // console.log(`ser`);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // User.findById(id, function (err, user) {
  //verify user
  // console.log(`des`);
  done(null, user);
  // });
});
//req.user

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.URL + "/auth/google/callback",
    },
    function (accessToken, reloadToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //use the profile info (mainly profile id) to check if the user is registered in your db
      // console.log(profile);
      return done(null, profile);
      // });
    }
  )
);
