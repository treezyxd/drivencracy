import { Router } from "express";
import db from "../config/database.js";
import Joi from "joi";
import { getPolls, createPoll } from "../controllers/pollController.js";
import validateSchema from "../middlewares/validateSchema.js";

const route = Router();

route.post('/poll', validateSchema, createPoll);

route.get('/poll', getPolls);

route.post('/choice', async (req, res) => {
  const { title, pollId } = req.body;

  const schema = Joi.string().required();

  if(schema.validate(title).error) {
    return res.sendStatus(422);
  }

  try {
    const user = await db.collection('polls').findOne({ title: title });

    if(user) return res.sendStatus(409);

    
  } catch(err) {
    console.log(err.message);
  }
});

export default route;