import { Request, Response, NextFunction } from "express";
import { loginUserSchema, option, registerUserSchema } from "../utils/utils";
import { UserInstance } from "../model/userModel";
import bcrypt from "bcrypt";
import { uuid } from "uuidv4";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

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

export const Login = async (req: Request, res: Response, next: NextFunction) => {
  // get req body
  const { email, password } = req.body;

  // validate with joi
  const validatedInput = loginUserSchema.validate(req.body, option);

  if (validatedInput.error) {
    return res.status(400).json({
      message: validatedInput.error.details[0].message,
    });
  }

  // check if the user exist
  const user = (await UserInstance.findOne({ where: { email: email } })) as unknown as {
    [key: string]: string;
  };
  if (!user) {
    return res.status(404).json({
      message: "You are not a valid user, please sign in",
    });
  }

  // destructure user id for token
  const { id } = user;

  // sign for a token that will expires in 30 days
  const token = jwt.sign({ id }, jwtSecret, { expiresIn: "30d" });

  // authenticate the user password by comparing the hashed one with the user input.
  const validUser = bcrypt.compare(password, user.password);

  if (!validUser) {
    return res.status(404).json({
      message: "Incorrect Password..",
    });
  }

  // display user datails
  return res.status(200).json({
    message: "Login Successfully!",
    user,
    token,
  });
};
