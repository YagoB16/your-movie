import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";
import authModel from "../models/authModel.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await authModel.findUserByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Este e-mail já está cadastrado." });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await authModel.createUser({
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
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
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

    const passwordMatch = await bcrypt.compare(password, user.password);

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await authModel.findUserByEmail(email);

    if (user) {
      const pinPass = crypto.randomInt(100000, 999999).toString();
      await authModel.createPasswordReset(email, pinPass);

      // Simulação de envio - O PIN aparecerá no console do VS Code
      console.log(`[EMAIL SIMULATION] PIN para ${email}: ${pinPass}`);
    }

    console.log(pinPass)
    return res.status(200).json({
      success: true,
      message: "Se o e-mail estiver cadastrado, um PIN foi enviado.",
      pin: pinPass
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao processar solicitação: " + error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, pin, newPassword } = req.body;

  try {
    const resetData = await authModel.findResetByEmailAndPin(email, pin);

    if (!resetData) {
      return res.status(400).json({ message: "PIN inválido ou e-mail incorreto." });
    }

    const agora = new Date();
    const expira = resetData.expiresAt.toDate();

    if (agora > expira) {
      return res.status(400).json({ message: "Este PIN expirou. Solicite um novo." });
    }

    const user = await authModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Chamada correta via Model (seguindo o padrão MVC)
    await authModel.updateUserPassword(user.id, passwordHash);

    // Limpar todos os PINs pendentes desse e-mail
    await authModel.deleteResetPins(email);

    return res.status(200).json({
      success: true,
      message: "Senha alterada com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao resetar senha: " + error.message });
  }
};