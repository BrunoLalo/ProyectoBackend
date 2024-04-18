
import passport from 'passport'
import jwt from 'passport-jwt';
import LocalStrategy from 'passport-local'
import GithubStrategy from 'passport-github2'
import userModel from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../utils.js'
import Users from '../dao/controllers/users.controller.mdb.js';


// const LocalStrategy = local.Strategy;
// const JwtStrategy = jwt.Strategy;
// const JWTExtractor = jwt.ExtractJwt;
const userService = new Users();


const initPassport = async () => {


  const verifyRestoration = async (req, username, password, done) => {
    try {
      if (username.length === 0 || password.length === 0) {
        return done("Faltan campos en el body", false);
      }

      const user = await userModel.findOne({ email: username });

      if (!user) return done(null, false);

      const process = await userModel.findOneAndUpdate(
        { email: username },
        { password: createHash(password) }
      );

      return done(null, process);
    } catch (err) {
      return done(`Error passport local: ${err.message}`);
    }
  };

  const verifyGithub = async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userModel
        .findOne({ email: profile._json.email })
        .lean();

      if (!user) {
        const name_parts = profile._json.name.split(" ");
        const newUser = {
          first_name: name_parts[0],
          last_name: name_parts[1],
          email: profile._json.email,
          gender: "NA",
          password: " ",
        };

        const process = await userModel.create(newUser);

        return done(null, process);
      } else {
        done(null, user);
      }
    } catch (err) {
      return done(`Error passport Github: ${err.message}`);
    }
  };


  passport.use(
    "restoreAuth",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "user_name",
        passwordField: "pass",
      },
      verifyRestoration
    )
  );

  passport.use('githubAuth', new GithubStrategy({
    clientID: 'Iv1.0c3c12fcc83c9770',
    clientSecret: 'ea4f406cbd6be3c160113f683ab29059a0a21072',
    callbackURL: 'http://localhost:5000/api/sessions/githubcallback'
  }, verifyGithub))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      done(null, await userModel.findById(id))
    } catch (err) {
      done(err.message)
    }
  })
}

export default initPassport