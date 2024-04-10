import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../utils.js'
import initPassport from "../config/passport.config.js"

initPassport()

const sessionRouter = Router();

const auth = (req, res, next) => {
  try {
    if (req.session.user) {
      if (req.session.user.admin === true) {
        next();
      } else {
        res.status(403).send({ status: "ERR", data: "Usuario no admin" });
      }
    } else {
      res.status(401).send({ status: "ERR", data: "Usuario no autorizado" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
};


sessionRouter.get('/', async (req, res) => {
  try {
    if (req.session.visits) {
      req.session.visits++;
      res.status(200).send({
        status: "OK",
        data: "Cantidad de visitas:${req.session.visits}",
      });
    } else {
      req.session.visits = 1;
      res.status(200).send({ status: "OK", data: "Bienvenido al site" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

sessionRouter.get('/failedRegister', (req, res) => {
  res.send('No se pudo completar el proceso, el usuario ya se encuentra registrado');
});

sessionRouter.get('/failedLogin', (req, res) => {
  res.send('No se pudo completar el login, la clave es incorrecta');
});

sessionRouter.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
  res.send({ status: 'OK', data: req.user });
});

sessionRouter.get('/private', async (req, res) => {
  res.status(200).send({ status: 'OK', data: 'Credenciales autorizadas para visualizar contenido privado' });
});

sessionRouter.get("/hash/:pass", async (req, res) => {
  res.status(200).send({ status: "OK", data: createHash(req.params.pass) });
});

sessionRouter.get('/logout', async (req, res) => {
  req.sessionStore.userValidated = false;

  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/api/sessions/session_home');
  });
});

sessionRouter.post(
  "/register", passport.authenticate("registerAuth", {
    failureRedirect: "/api/sessions/failedregister"
  }),
  async (req, res) => {
    try {
      res.status(200).send({ status: "OK", data: "Usuario registrado" });
    } catch (err) {
      res.status(500).send({ status: "ERR", data: err.message });
    }
  }
);

sessionRouter.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;

    const userInDb = await usersModel.findOne({ email: email });

    if (userInDb !== null) {
      if (isValidPassword(userInDb, pass)) {
        req.session.user = { username: email, admin: true };
        res.redirect("/profile");
      }
    } else {
      res.status(401).send({ status: "ERR", data: "Datos no válidos" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

sessionRouter.get(
  "/github",
  passport.authenticate("githubAuth", { scope: ["user:email"] }),
  async (req, res) => { }
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("githubAuth", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = { username: req.user.email, admin: true };
    res.redirect("/profile");
  }
);



export default sessionRouter;