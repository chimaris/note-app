import Joi from "joi";

export const registerUserSchema = Joi.object().keys({
  fullname: Joi.string().min(4).max(30).required(),
  email: Joi.string().trim().lowercase().required(),
  gender: Joi.string().required(),
  phone: Joi.string().min(11).max(11).required(),
  address: Joi.string().required(),
  password: Joi.string().min(3).required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const loginUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string().min(3).required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const createNoteSchema = Joi.object().keys({
  Title: Joi.string().trim().required(),
  description: Joi.string().required(),
  DueDate: Joi.date().required(),
  // status: Joi.string().required(),
});


export const updateNoteSchema = Joi.object().keys({
  Title: Joi.string().trim(),
  description: Joi.string(),
  DueDate: Joi.date(),
  status: Joi.string(),
});

