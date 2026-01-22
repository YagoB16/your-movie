import { jest } from "@jest/globals";

// 1. Mock das funções do Firebase
jest.unstable_mockModule("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => ({ id: "users_coll" })),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
}));

// 2. Importações dinâmicas
const { getDocs, addDoc } = await import("firebase/firestore");
const authModel = (await import("../models/authModel.js")).default;

describe("Auth Model - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserByEmail", () => {
    it("deve retornar os dados do usuário se o e-mail existir", async () => {
      // Simula o snapshot do Firestore com um usuário encontrado
      const mockUser = { id: "user123", email: "yago@teste.com", senha: "hash" };
      getDocs.mockResolvedValue({
        empty: false,
        docs: [{ id: "user123", data: () => ({ email: "yago@teste.com", senha: "hash" }) }]
      });

      const result = await authModel.findUserByEmail("yago@teste.com");

      expect(result).toEqual(mockUser);
      expect(getDocs).toHaveBeenCalled();
    });

    it("deve retornar null se o e-mail não for encontrado", async () => {
      getDocs.mockResolvedValue({ empty: true });

      const result = await authModel.findUserByEmail("inexistente@teste.com");

      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("deve criar um usuário e retornar o ID gerado", async () => {
      addDoc.mockResolvedValue({ id: "new_user_id" });

      const userData = { email: "novo@teste.com", senha: "123", role: "admin" };
      const result = await authModel.createUser(userData);

      expect(result).toHaveProperty("id", "new_user_id");
      expect(result.email).toBe("novo@teste.com");
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ email: "novo@teste.com", role: "admin" })
      );
    });
  });

  
});
