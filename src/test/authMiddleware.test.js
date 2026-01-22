import { jest } from "@jest/globals";

// Mock do JWT e do Config
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
}));

jest.unstable_mockModule("../config/auth.js", () => ({
  default: { secret: "test_secret" },
}));

const jwt = (await import("jsonwebtoken")).default;
const authMiddleware = (await import("../middlewares/authMiddleware.js"))
  .default;

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("deve chamar next() e injetar user no req se o token for válido", async () => {
    req.headers.authorization = "Bearer token_valido";

    // Simulamos o comportamento do callback (err, decoded)
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: "123", role: "admin" });
    });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    // Ajustado para 'user' conforme seu código
    expect(req.user).toEqual({ id: "123", role: "admin" });
  });

  it("deve retornar 401 se o token for inválido ou expirado", () => {
    req.headers.authorization = "Bearer token_invalido";

    // Simulamos um erro no callback
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Token expired"), null);
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Token inválido ou expirado.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o header de autorização estiver ausente", async () => {
    // req.headers.authorization já está vazio pelo beforeEach
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token não fornecido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o token não tiver duas partes", async () => {
    req.headers.authorization = "Bearer";

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Formato do token inválido",
    });
  });

  it("deve retornar 401 se o scheme não for Bearer", async () => {
    req.headers.authorization = "Basic token123"; // Scheme errado

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token mal formatado." });
  });
});
