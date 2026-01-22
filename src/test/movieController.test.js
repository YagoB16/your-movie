import { jest } from "@jest/globals";
import request from "supertest";

// 1. Mock do middleware de autenticação para liberar as rotas nos testes
jest.unstable_mockModule("../middlewares/authMiddleware.js", () => ({
  default: (req, res, next) => {
    req.user = { id: "user123", role: "admin" };
    next();
  },
}));

// 2. Mocks dos Models e Services para isolar o Controller
jest.unstable_mockModule("../models/movieModel.js", () => ({
  default: {
    createMovie: jest.fn(),
    getMovies: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  }
}));

jest.unstable_mockModule("../services/externalApiService.js", () => ({
  getMovieById: jest.fn(),
  searchMovie: jest.fn(),
  fetchExternalMovieData: jest.fn(),
}));

const movieModel = (await import("../models/movieModel.js")).default;
const externalApi = await import("../services/externalApiService.js");
const app = (await import("../app.js")).default;

describe("Movie Controller - Cobertura Total", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Cobre Linha 20 (Catch do Create) ---
  it("deve chamar o next(error) se a criação de filme falhar", async () => {
    movieModel.createMovie.mockRejectedValue(new Error("Erro de Banco"));

    const response = await request(app)
      .post("/movies")
      .send({ titulo: "Filme Erro", descricao: "Descricao longa para passar no Zod", anoLancamento: 2020 });

    // Se houver um errorMiddleware configurado no app.js, ele retornará 500
    expect(response.status).toBe(500);
  });

  // --- Cobre Linhas 37-48 (Buscas OMDb) ---
  describe("Buscas na API Externa (OMDb)", () => {
    it("listMovieById deve retornar 200 ao buscar por ID (Linhas 37-48)", async () => {
      externalApi.getMovieById.mockResolvedValue({ Title: "Batman Begins", Response: "True" });

      const response = await request(app).get("/movies/external/tt0372784");

      expect(response.status).toBe(200);
      expect(response.body.data.Title).toBe("Batman Begins");
    });

    it("searchMovie deve retornar 200 na busca por termo (Linhas 37-48)", async () => {
      externalApi.searchMovie.mockResolvedValue({ Search: [{ Title: "Batman" }], Response: "True" });

      const response = await request(app).get("/movies/external/search?q=Batman");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.Search[0].Title).toBe("Batman");
    });
  });

  // --- Cobre Linhas 53-61 (Erros de Listagem e Update) ---
  it("deve tratar erro na listagem de filmes (Linhas 53-61)", async () => {
    movieModel.getMovies.mockRejectedValue(new Error("Falha na listagem"));

    const response = await request(app).get("/movies");
    expect(response.status).toBe(500);
  });

  it("deve tratar erro no update de filme (Linhas 53-61)", async () => {
    movieModel.updateMovie.mockRejectedValue(new Error("Falha no update"));

    const response = await request(app)
      .put("/movies/id_qualquer")
      .send({ titulo: "Novo Titulo" });

    expect(response.status).toBe(500);
  });
});
