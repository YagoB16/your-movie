import { jest } from "@jest/globals";

// 1. Mock completo do Firebase
jest.unstable_mockModule("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => ({ id: "movies_coll" })),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn((db, coll, id) => ({ id })),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

const { addDoc, getDocs, getDoc, updateDoc, deleteDoc } = await import("firebase/firestore");
const movieModel = (await import("../models/movieModel.js")).default;

describe("Movie Model - Unit Tests (Cobertura Total)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createMovie", () => {
    it("deve criar um filme com sucesso se não for duplicado", async () => {
      getDocs.mockResolvedValue({ empty: true });
      addDoc.mockResolvedValue({ id: "id_firebase_123" });

      const movieData = { titulo: "Batman", anoLancamento: 2005 };
      const result = await movieModel.createMovie(movieData);

      expect(result).toHaveProperty("id", "id_firebase_123");
      expect(addDoc).toHaveBeenCalled();
    });

    it("deve lançar erro 409 se o filme já existir (Cobre linhas 26-28)", async () => {
      // Simula que o snapshot NÃO está vazio
      getDocs.mockResolvedValue({ empty: false });

      await expect(movieModel.createMovie({ titulo: "Batman", anoLancamento: 2005 }))
        .rejects.toThrow("Este filme já está cadastrado no catálogo.");
    });
  });

  describe("getMovies", () => {
    it("deve formatar a lista de filmes corretamente", async () => {
      const mockSnapshot = {
        docs: [
          { id: "1", data: () => ({ titulo: "Matrix", ano_lancamento: 1999 }) }
        ]
      };
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await movieModel.getMovies();
      expect(result[0]).toEqual(expect.objectContaining({ id: "1", anoLancamento: 1999 }));
    });
  });

  describe("updateMovie", () => {
    it("deve lançar erro 404 se o filme não existir (Cobre linhas 48-51)", async () => {
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(movieModel.updateMovie("id_invalido", { titulo: "Novo" }))
        .rejects.toThrow("Filme não encontrado no banco de dados.");
    });

    it("deve atualizar com sucesso convertendo para snake_case", async () => {
      getDoc.mockResolvedValue({ exists: () => true });
      updateDoc.mockResolvedValue(true);

      const updateData = { titulo: "Novo", anoLancamento: 2024 };
      await movieModel.updateMovie("123", updateData);

      expect(updateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ id: "123" }),
        expect.objectContaining({ ano_lancamento: 2024 })
      );
    });
  });

  describe("deleteMovie", () => {
    it("deve lançar erro 404 se o filme a deletar não existir (Cobre linhas 66-68)", async () => {
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(movieModel.deleteMovie("id_invalido"))
        .rejects.toThrow("Filme não encontrado no banco de dados.");
    });

    it("deve deletar o filme com sucesso (Cobre linhas 84-94)", async () => {
      getDoc.mockResolvedValue({ exists: () => true });
      deleteDoc.mockResolvedValue(undefined);

      const result = await movieModel.deleteMovie("123");

      expect(result).toBe("123");
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});
