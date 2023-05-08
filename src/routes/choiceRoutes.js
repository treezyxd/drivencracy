import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js";
import choiceSchema from "../schemas/choiceSchema.js";
import { postChoice , getChoices, postVote} from "../controllers/choiceController.js";

const choiceRoutes = Router();

choiceRoutes.post("/choice", validateSchema(choiceSchema), postChoice);

choiceRoutes.get("/poll/:id/choice", getChoices);

choiceRoutes.post("/choice/:id/vote", postVote);

export default choiceRoutes;