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

export const createOrganizationSchema = Joi.object().keys({
  organization: Joi.string().trim().min(4).required(),
  marketValue: Joi.string().trim().lowercase().required(),
  ceo: Joi.string().required(),
  country: Joi.string().required(),
  employees: Joi.array().items(Joi.string()),
  products: Joi.array().items(Joi.string()),
  address: Joi.string().required(),
});

export const updateOrganizationSchema = Joi.object().keys({
  organization: Joi.string().trim().min(4),
  marketValue: Joi.string().trim().lowercase(),
  ceo: Joi.string(),
  country: Joi.string(),
  employees: Joi.array().items(Joi.string()),
  products: Joi.array().items(Joi.string()),
  address: Joi.string(),
});

// organization: string;
//   products: string[];
//   marketValue: string;
//   address: string;
//   ceo: string;
//   country: string;
//   noOfEmployees: number;
//   employees: string[];
