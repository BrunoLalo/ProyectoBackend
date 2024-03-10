
import passport from 'passport'
import jwt from 'passport-jwt';
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import userModel from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../utils.js'
import Users from '../dao/controllers/users.controller.mdb.js';

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const JWTExtractor = jwt.ExtractJwt;
const userService = new Users();

const cookieExtractor = (req) => {
    if (req && req.cookies) { return req.cookies['coderCookie']; } 
    return null;
}


const initPassport = async() => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'userName', passwordField: 'password', session: false }, async(userName, password, done) => {
        try {            
            const exists = await userService.getUserBy({ userName: userName });
            if(exists) return done(null, false, { message: 'El usuario ya se encuentra registrado' });
            
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                gender,
                role
            }

            let result = await userService.addUser(newUser);
            return done(null, result);
        } catch(err) {
            return done(err.message);
        }
    }))

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

    passport.use('login', new LocalStrategy({ usernameField: 'userName', passwordField: 'password', session: false }, async (userName, password, done) => {
        try {
            const user = await userService.getUserBy({ userName: userName });
            if (!user) return done(null, false, { messages: 'No se encuentra el usuario' });
            const passwordValidation = isValidPassword(user.password, password);
            if (!passwordValidation) return done(null, false, { messages: 'Clave incorrecta' });
            return done(null, user);
        } catch (err) {
            return done(err.message);
        }
    }));

    passport.use('current', new JwtStrategy({ jwtFromRequest: JWTExtractor.fromExtractors([cookieExtractor]), secretOrKey: 'Bruno123' }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (err) {
            return done(err.message);
        }
    }));

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