
import passport from 'passport'
import jwt from 'passport-jwt';
import LocalStrategy from 'passport-local'
import GithubStrategy from 'passport-github2'
import userModel from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../utils.js'
import Users from '../dao/controllers/users.controller.mdb.js';
import { GITHUB_AUTH } from '../config.js';


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
      const user = await userModel.findOne({ email: profile._json.company }).lean();

      if (!user) {
        const newUser = {
          first_name: profile._json.name,
          last_name: '',
          user_name:'',
          email: profile._json.company,
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
    clientID: GITHUB_AUTH.clientId,
    clientSecret: GITHUB_AUTH.clientSecret,
    callbackURL: GITHUB_AUTH.callbackUrl
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