import joi from "joi";

const pollSchema = joi.object({
  title: joi.string().min(1).required(),
  expiredAt: joi.string().required()
});

export default pollSchema;