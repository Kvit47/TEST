const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const username = profile.displayName || email.split('@')[0];

        // Check if user exists by googleId or email
        let user = await UserModel.findOne({ 
          $or: [{ googleId }, { email }] 
        });

        if (user) {
          // Update googleId if user exists but doesn't have it
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
        } else {
          // Create new user
          user = new UserModel({
            username: username,
            email: email,
            googleId: googleId,
            avatarUrl: profile.photos?.[0]?.value || "",
            role: "client",
          });
          await user.save();
        }

        // Create JWT token with our database user ID
        const token = jwt.sign(
          { userId: user._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: "7d" }
        );

        return done(null, { token, user });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
