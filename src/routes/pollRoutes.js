import { Router } from "express";
import { getPolls, createPoll, getResult } from "../controllers/pollController.js";
import validateSchema from "../middlewares/validateSchema.js";

const pollRoutes = Router();

pollRoutes.post('/poll', validateSchema, createPoll);

pollRoutes.get('/poll', getPolls);

pollRoutes.get('/poll/:id/result', getResult);

export default pollRoutes;