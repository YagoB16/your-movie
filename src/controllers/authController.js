import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';
import authModel from '../models/authModel.js';

const { findUserByEmail, createUser } = authModel;

export const register = async (req, res) => {
    const { email, senha, role } = req.body;

    try {

        const userExists = await findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "Este e-mail já está cadastrado." });
        }


        const newUser = await createUser({ email, senha, role });

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            authConfig.secret,
            { expiresIn: authConfig.expiresIn }
        );

        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            user: { id: newUser.id, email: newUser.email },
            token
        });

    } catch (error) {
        return res.status(500).json({ message: "Erro ao registrar usuário: " + error.message });
    }
};

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await authModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        // TODO usar bcrypt.compare
        if (senha !== user.senha) {
            return res.status(401).json({ message: "Senha inválida" });
        }

        // Geração do Token
        const token = jwt.sign(
            { id: user.id, role: user.role || 'user' },
            authConfig.secret,
            { expiresIn: '1d' }
        );

        return res.json({
            user: { id: user.id, email: user.email },
            token
        });

    } catch (error) {
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};
