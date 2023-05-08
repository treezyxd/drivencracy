import joi from "joi";

const pollSchema = joi.object({
  title: joi.string().required(),
  expiredAt: joi.string().required()
});

export default pollSchema;