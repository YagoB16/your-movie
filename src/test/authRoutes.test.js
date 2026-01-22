import { jest } from "@jest/globals"; // 1. Importação necessária para ESM
import request from "supertest";
import bcrypt from "bcrypt";

// 2. Mock dos módulos ANTES dos imports dinâmicos
jest.unstable_mockModule("../config/auth.js", () => ({
  default: {
    secret: "test_secret",
    expiresIn: "1h",
  },
}));

jest.unstable_mockModule("../models/authModel.js", () => ({
  default: {
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
  }
}));

const authModel = (await import("../models/authModel.js")).default;
const app = (await import("../app.js")).default;

describe("Auth Routes", () => {
  it("deve registrar um novo usuário com sucesso", async () => {
    authModel.findUserByEmail.mockResolvedValue(null);
    authModel.createUser.mockResolvedValue({ id: "123", email: "yago@teste.com", role: "user" });

    const response = await request(app)
      .post("/auth/register")
      .send({ email: "yago@teste.com", senha: "password123" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("deve retornar um token JWT ao logar com sucesso", async () => {
    const senhaPlana = "password123";
    const senhaHash = await bcrypt.hash(senhaPlana, 10); // Gera hash real para o mock

    authModel.findUserByEmail.mockResolvedValue({
      id: "123",
      email: "yago@teste.com",
      senha: senhaHash 
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "yago@teste.com", senha: senhaPlana });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.success).toBe(true);
  });
});
