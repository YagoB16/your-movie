import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn()
}));

// 2. Importações dinâmicas
const { getDocs } = await import("firebase/firestore");
const app = (await import("../app.js")).default;

describe("System Controller - Health Check", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 200 e status CONNECTED quando o banco responder", async () => {
    getDocs.mockResolvedValue({ empty: true });

    const response = await request(app).get("/system/health");

    expect(response.status).toBe(200);
    expect(response.body.services.database).toBe("CONNECTED");
  });

  it("deve retornar 503 e status DISCONNECTED quando o banco falhar", async () => {
    getDocs.mockRejectedValue(new Error("Firebase Connection Error"));

    const response = await request(app).get("/system/health");

    expect(response.status).toBe(503);
    expect(response.body.services.database).toBe("DISCONNECTED");
  });
});
