import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

// Rotas
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/system", systemRoutes);


app.use(errorMiddleware);

export default app;
