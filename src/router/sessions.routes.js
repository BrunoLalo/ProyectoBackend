import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import userModel from '../dao/models/users.model.js'
import { isValidPassword } from '../utils.js';

const sessionRouter = () => {
    const router = Router();
    
    router.get('/session_home', async (req, res) => {
        if (req.sessionStore.userValidated) { // El usuario está autenticado
            res.status(200).send('Todo OK, usuario autenticado!');
        } else {
            res.status(200).send('ERROR, usuario no autenticado');
        }
    });

    router.get('/failedRegister', (req, res) => {
        res.send('No se pudo completar el proceso, el usuario ya se encuentra registrado');
    });

    router.get('/failedLogin', (req,res) => {
        res.send('No se pudo completar el login, la clave es incorrecta');
    });

    router.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
        res.send({ status: 'OK', data: req.user });
    });

    router.get('/private', async (req, res) => {
        res.status(200).send({ status: 'OK', data: 'Credenciales autorizadas para visualizar contenido privado' });
    });

    router.get('/session_logout', async (req, res) => {
        req.sessionStore.userValidated = false;
        
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/api/sessions/session_home');
        });
    });

    router.get('/token_logout', async (req, res) => {
        res.clearCookie('coderCookie');
        res.redirect('/token_login');
    });

    router.post('/register', passport.authenticate('register', {
        session: false,
        passReqToCallback: true,
        failureRedirect:'api/sessions/failedRegister',
        failureMessage: true }),(req,res) => {
            res.send({ status: 'OK', message: 'Usuario registrado', payload: req.user._id });
    });
    
    router.post('/session_login', async (req, res) => {
        req.sessionStore.userValidated = false;
        const { userName, password } = req.body; 
            
        const user = await userModel.findOne({ userName: userName });
            
        if (!user) {
            req.sessionStore.errorMessage = 'No se encuentra el usuario';
        } else if (!isValidPassword(user.password, password)) {
            req.sessionStore.errorMessage = 'Clave incorrecta';
        } else {
            req.sessionStore.userValidated = true;
            req.sessionStore.errorMessage = '';
            req.sessionStore.firstName = user.firstName;
            req.sessionStore.lastName = user.lastName;
        }
        
        res.redirect('/api/sessions/session_home');
    });

    router.post('/token_login', passport.authenticate('login', {
        session: false,
        failureRedirect: '/api/sessions/failedLogin' }), (req, res) => {
            const serializedUser = {
                id : req.user._id,
                name : `${req.user.firstName} ${req.user.lastName}`,
                role: req.user.role,
                email: req.user.userName
            }
            const token = jwt.sign(serializedUser, 'abcdefgh12345678', { expiresIn: '24h' });
            res.cookie('coderCookie', token, { maxAge: 3600000, httpOnly: true }).send({ status: 'OK', payload: serializedUser }); // maxAge en milisegundos
    });

    return router;
}


export default sessionRouter;