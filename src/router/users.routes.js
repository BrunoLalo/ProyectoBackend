import { Router } from "express";
import Users from '../dao/controllers/users.controller.mdb.js';
import { UserRepository } from "../repository/user.repository.js";
import { createHash } from '../utils.js';
import { authUser } from "../middleware/auth.js";
import { notAuth, admin, soloRoles, isAdmin } from "../middleware/authorization.js"

const userRoutes = () => {
    const router = Router();
    const manager = new Users();

    router.get('/', async (req, res) => {
        const users = await manager.getUsers();
        if (!users) return res.status(500).send({ status: 'ERR', error: 'Error interno al obtener usuarios' });

        res.status(200).send({ status: 'OK', payload: users });
    });

    router.get('/:uid', async (req, res) => {
        const user = await manager.getUserById(req.params.uid);
        if (!user) return res.status(200).send({ status: 'ERR', error: 'No se encuentra el usuario' });

        res.status(200).send({ status: 'OK', payload: user });
    });

    router.post('/', async (req, res) => {
        const { firstName, lastName, email, password, gender, role } = req.body;
        if (!firstName || !lastName || !email || !password || !gender || !role) return res.status(400).send({ status: 'ERR', error: 'Se requieren los campos firstName, lastName, userName, password y gender' });

        const newUser = { firstName: firstName, lastName: lastName, email: email, password: createHash(password), gender: gender, role: role };
        const result = await manager.addUser(newUser);
        if (!result) return res.status(500).send({ status: 'ERR', error: 'Error interno al agregar usuario' });
        res.status(200).send({ status: 'OK', payload: result });
    });

    router.get('/current', authUser, soloRoles(['users']), async (req, res) => {
        try {
            const user = req.session.user;

            if (user) {
                const usuario = await UserRepository.getUserById(user.id);
                res.successfullGet(usuario);
            } else {
                res.failedGet();
            }
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    })

    router.get('/admin', authUser, soloRoles(['admin']), async (req, res) => {
        try {
            const usuario = await Users.find().lean();
            res.successfullGet(usuario);
          } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
          }
    })

    router.get('/roles', authUser, soloRoles(['admin']), async (req, res) => {
        try {
            const usuario = await Users.find().lean();
            res.successfullGet(usuario);
          } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
          }
        
    })

    return router;
}

export default userRoutes;