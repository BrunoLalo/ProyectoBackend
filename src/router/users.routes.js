import { Router } from "express";
import Users from '../dao/controllers/users.controller.mdb.js';
import { UserRepository } from "../repository/user.repository.js";
import { usersServices } from "../services/user.service.js";
import { createHash } from '../utils.js';
import { authUser } from "../middleware/auth.js";
import { notAuth, admin, soloRoles, isAdmin, isPremium } from "../middleware/authorization.js"

const userRoutes = Router();
const manager = new Users();


    userRoutes.get('/', async (req, res) => {
        const users = await manager.getUsers();
        if (!users) return res.status(500).send({ status: 'ERR', error: 'Error interno al obtener usuarios' });

        res.status(200).send({ status: 'OK', payload: users });
    });

    userRoutes.get('/:uid', async (req, res) => {
        const user = await manager.getUserById(req.params.uid);
        if (!user) return res.status(200).send({ status: 'ERR', error: 'No se encuentra el usuario' });

        res.status(200).send({ status: 'OK', payload: user });
    });

    userRoutes.post('/', async (req, res) => {
        const { first_name, last_name, email, gender, password, role } = req.body;
        if (!first_name || !last_name || !email || !gender || !password || !role) return res.status(400).send({ status: 'ERR', error: 'Se requieren los campos firstName, lastName, password, gender y role' });

        const newUser = { first_name: first_name, last_name: last_name, email: email,  gender: gender,password: createHash(password), role: role };
        const result = await manager.addUser(newUser);
        if (!result) return res.status(500).send({ status: 'ERR', error: 'Error interno al agregar usuario' });
        res.status(200).send({ status: 'OK', payload: result });
    });

    userRoutes.get('/current', authUser, soloRoles(['users']), async (req, res) => {
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

    userRoutes.get('/admin', authUser, soloRoles(['admin']), async (req, res) => {
        try {
            const usuario = await Users.find().lean();
            res.successfullGet(usuario);
          } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
          }
    })

    userRoutes.get('/roles', authUser, soloRoles(['admin']), async (req, res) => {
        try {
            const usuario = await Users.find().lean();
            res.successfullGet(usuario);
          } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
          }
        
    })

    userRoutes.put('/premium/:uid', authUser, isPremium, async (req, res) =>{
        try {
            const userId = req.params.userId;
            const { role } = req.body; 
            const updatedUser = await usersServices.updateUserRole(userId, role);
            res.json(updatedUser);
         } catch (error) {
            next(error);
        }
    })



export default userRoutes;