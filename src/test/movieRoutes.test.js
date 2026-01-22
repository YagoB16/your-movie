import { jest } from "@jest/globals";
import request from "supertest";

// 🔴 Mock do auth middleware (libera acesso)
jest.unstable_mockModule("../middlewares/authMiddleware.js", () => ({
  default: (req, res, next) => next(),
}));

//  Mock do model
jest.unstable_mockModule("../models/movieModel.js", () => ({
  default: {
    createMovie: jest.fn(),
    getMovies: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  },
}));

const movieModel = (await import("../models/movieModel.js")).default;
const app = (await import("../app.js")).default;

describe("POST /movies", () => {
  it("deve retornar 400 se os dados enviados forem inválidos (falha no Zod)", async () => {
    const response = await request(app)
      .post("/movies")
      .set("Authorization", "Bearer token_valido")
      .send({
        titulo: "",
        anoLancamento: "dois mil e cinco",
      });

    expect(response.body.status).toBe("Erro de Validação");
    expect(response.status).toBe(400);

    const camposComErro = response.body.erros.map((erro) => erro.campo);

    expect(camposComErro).toEqual(
      expect.arrayContaining(["titulo", "descricao", "anoLancamento"]),
    );
  });

  it("deve retornar 409 se o filme já estiver cadastrado", async () => {
    movieModel.createMovie.mockImplementation(() => {
      const error = new Error("Este filme já está cadastrado no catálogo.");
      error.statusCode = 409;
      throw error;
    });

    const response = await request(app)
      .post("/movies")
      .set("Authorization", "Bearer token_valido")
      .send({
        titulo: "Batman",
        descricao: "O Cavaleiro das Trevas",
        anoLancamento: 2005,
      });

    expect(response.status).toBe(409);

    expect(response.body.message).toBe(
      "Este filme já está cadastrado no catálogo.",
    );
  });

  it("deve retornar 201 ao cadastrar um filme com sucesso", async () => {
    movieModel.createMovie.mockResolvedValue({
      id: "3lkU0Sn9cRmx72eUU0kd",
      titulo: "Batman",
    });

    const response = await request(app)
      .post("/movies")
      .set("Authorization", "Bearer token_valido")
      .send({
        titulo: "Batman",
        descricao: "O Cavaleiro das Trevas",
        anoLancamento: 2005,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(movieModel.createMovie).toHaveBeenCalled();
    expect(response.body.info).toMatchObject({
      id: "3lkU0Sn9cRmx72eUU0kd",
      titulo: "Batman",
    });
  });
});

describe("GET /movies", () => {
  it("deve retornar uma lista de filmes com sucesso", async () => {
    const mockMovies = [
      {
        id: "1",
        titulo: "Inception",
        descricao: "Sci-fi",
        anoLancamento: 2010,
      },
      { id: "2", titulo: "Batman", descricao: "Action", anoLancamento: 2005 },
    ];

    movieModel.getMovies.mockResolvedValue(mockMovies);

    const response = await request(app).get("/movies");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.info)).toBe(true);
    expect(response.body.info).toHaveLength(2);
    expect(response.body.info[0]).toMatchObject({
      id: "1",
      titulo: "Inception",
    });
  });

  it("deve retornar um array vazio se não houver filmes no banco", async () => {
    movieModel.getMovies.mockResolvedValue([]);

    const response = await request(app).get("/movies");

    expect(response.status).toBe(200);

    expect(response.body.info).toEqual([]);
    expect(response.body.info).toHaveLength(0);
  });

  it("deve retornar 500 se o serviço de listagem falhar", async () => {
    //Simulamos uma falha no service/model
    movieModel.getMovies.mockRejectedValue(
      new Error("Erro interno no Firestore"),
    );

    const response = await request(app).get("/movies");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);

    expect(response.body).toHaveProperty("message");
  });
});

describe("PUT /movies/:id", () => {
  it("deve atualizar um filme com sucesso (update parcial)", async () => {
    const updatedData = { titulo: "Novo Título" };
    movieModel.updateMovie.mockResolvedValue({
      id: "123",
      titulo: "Novo Título",
    });

    const response = await request(app)
      .put("/movies/dccgj2UTjkgXU8udUwo")
      .set("Authorization", "Bearer token_valido")
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.info.titulo).toBe("Novo Título");
    expect(movieModel.updateMovie).toHaveBeenCalledWith("dccgj2UTjkgXU8udUwo", updatedData);
  });

  it("deve retornar 404 se o filme não existir no Firestore", async () => {
    movieModel.updateMovie.mockImplementation(() => {
      const error = new Error("Filme não encontrado no banco de dados.");
      error.statusCode = 404;
      throw error;
    });

    const response = await request(app)
      .put("/movies/id_invalido")
      .set("Authorization", "Bearer token_valido")
      .send({ titulo: "Qualquer Título" });

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("não encontrado");
  });

  it("deve retornar 400 se enviar dados inválidos no update", async () => {
    const response = await request(app)
      .put("/movies/dccgj2UTjkgXU8udUwo")
      .set("Authorization", "Bearer token_valido")
      .send({
        anoLancamento: 1800, // Erro: deve ser > 1895
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

    expect(response.body.erros).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ campo: "anoLancamento" }),
      ]),
    );
  });
});

describe("DELETE /movies/:id", () => {
  it("deve deletar um filme com sucesso", async () => {
    
    movieModel.deleteMovie.mockResolvedValue(true);

    const response = await request(app)
      .delete("/movies/ID_PARA_DELETAR")
      .set("Authorization", "Bearer token_valido");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.message).toContain("Filme deletado");
    expect(movieModel.deleteMovie).toHaveBeenCalledWith("ID_PARA_DELETAR");
  });

  it("deve retornar 404 se o filme a ser deletado não existir", async () => {
    // Simulamos o erro de 'não encontrado' que o model/service lança
    movieModel.deleteMovie.mockImplementation(() => {
      const error = new Error("Filme não encontrado.");
      error.statusCode = 404;
      throw error;
    });

    const response = await request(app)
      .delete("/movies/ID_INEXISTENTE")
      .set("Authorization", "Bearer token_valido");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Filme não encontrado.");
  });
});
