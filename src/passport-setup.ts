import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user already exists in our db
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // If user exists, return the user
        return done(null, existingUser);
      }

      // If user does not exist, create a new user
      const newUser = new User({
        googleId: profile.id,
        email: profile.emails![0].value,
        name: profile.displayName,
      });
      await newUser.save();
      done(null, newUser);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await User.findById(id);
  done(null, user);
});
