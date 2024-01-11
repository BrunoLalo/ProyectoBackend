import { Router } from "express";
import Users from '../dao/controllers/users.controller.mdb.js';
import { __dirname } from '../utils.js';

const userRoutes = (io) => {
    const router = Router();
    const manager = new Users();

    const validate = async (req, res, next) => {
        if (req.session.userValidated) {
            next();
        } else {
            res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
        }
    }
       
    router.get('/:id?', validate, async (req, res) => { 
        try {
            if (req.params.id === undefined) {
                const users = await manager.getUsers();
                res.status(200).send({ status: 'OK', data: users });
            } else {
                const user = await manager.getUserById(req.params.id);
                res.status(200).send({ status: 'OK', data: user });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: 'No se encuentra el usuario' });
        }
    });
    
    router.post('/', validate, async (req, res) => {
        try {
            await manager.addUser(req.body);
            io.emit('new_user', req.body);
    
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK'});
            } else {
                res.status(400).send({ status: 'ERR' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ status: 'ERR', error: 'No se puede agregar el usuario' });
        }
    });
    
    
    return router;
}

export default userRoutes;