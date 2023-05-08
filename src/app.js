import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pollRoutes from "./routes/pollRoutes.js";
import choiceRoutes from "./routes/choiceRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(choiceRoutes);
app.use(pollRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));