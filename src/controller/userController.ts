import { Request, Response, NextFunction } from "express";
import { option, registerUserSchema } from "../utils/utils";
import { UserInstance } from "../model/userModel";
import bcrypt from "bcrypt";
import { uuid } from "uuidv4";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
  // Get data from req body
  const { email, password } = req.body;
  const id = uuid();

  // Validate with joi
  const validatedInput = registerUserSchema.validate(req.body, option);

  if (validatedInput.error) {
    return res.status(400).json({
      message: validatedInput.error.details[0].message,
    });
  }

  // check if the user already exist
  const user = await UserInstance.findOne({ where: { email: email } });
  if (user) {
    return res.status(401).json({
      message: "Email is already exist",
    });
  }

  // Hash the password
  const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt());
  req.body.password = passwordHashed;

  // save to database
  const newUser = await UserInstance.create({
    id: id,
    ...req.body,
  });

  res.status(201).json({
    message: "Created Successfully",
    data: newUser,
  });
};
