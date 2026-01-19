import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";

const app = express();

app.use(express.json());

// Rotas
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/system", systemRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
