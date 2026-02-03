import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";
import authModel from "../models/authModel.js";

const { findUserByEmail, createUser } = authModel;

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Este e-mail já está cadastrado." });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser({
      name,
      email,
      password: passwordHash,
      role,
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn },
    );

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso!",
      user: { id: newUser.id, nome: newUser.nome, email: newUser.email, name: newUser.name },
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao registrar usuário: " + error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }

    const passwordMatch = await bcrypt.compare(password, user.senha);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role || "user" },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn },
    );

    return res.json({
      success: true,
      info: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
