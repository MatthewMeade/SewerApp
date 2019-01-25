// Import Strategy
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// Load User Model
const User = require("../models/User");

module.exports = async passport => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GoogleClientID,
        clientSecret: process.env.GoogleClientSecret,
        callbackURL: "/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        // Ensure whitelisted user
        if (
          process.env.EmailWhitelist.split(",").indexOf(
            profile.emails[0].value
          ) <= 0
        ) {
          return done(null, false, "Your email is not on the whitelist");
        }

        // Check for user with existing email
        const existingUser = await User.findOne({
          email: profile.emails[0].value
        });

        // Create new user if none exists
        if (!existingUser) {
          const newUser = await new User({
            googleID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          }).save();

          return done(null, newUser);
        }

        // User exists and is already registered through google
        if (existingUser.googleID) {
          return done(null, existingUser);
        }

        // User exists but did not register through google
        // Add googleID to their account
        existingUser.googleID = profile.id;
        return done(null, await existingUser.save());
      }
    )
  );
};
