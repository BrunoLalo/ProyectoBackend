import { Router } from "express";
import Users from '../dao/controllers/users.controller.mdb.js';
import { createHash } from '../utils.js';

const userRoutes = () => {
    const router = Router();
    const manager = new Users();
       
    router.get('/', async(req, res) => {
        const users = await manager.getUsers();
        if (!users) return res.status(500).send({ status: 'ERR', error: 'Error interno al obtener usuarios' });

        res.status(200).send({ status: 'OK', payload: users });
    });

    router.get('/:uid', async(req, res) => {
        const user = await manager.getUserById(req.params.uid);
        if (!user) return res.status(200).send({ status: 'ERR', error: 'No se encuentra el usuario' });

        res.status(200).send({ status: 'OK', payload: user });
    });
    
    router.post('/', async(req, res) => {
        const { firstName, lastName, email, password, gender, role } = req.body;
        if (!firstName || !lastName || !email || !password || !gender || !role) return res.status(400).send({ status: 'ERR', error: 'Se requieren los campos firstName, lastName, userName, password y gender' });

        const newUser = { firstName: firstName, lastName: lastName, email: email, password: createHash(password), gender: gender, role: role };
        const result = await manager.addUser(newUser);
        if (!result) return res.status(500).send({ status: 'ERR', error: 'Error interno al agregar usuario' });
        res.status(200).send({ status: 'OK', payload: result });
    });
    
    return router;
}

export default userRoutes;