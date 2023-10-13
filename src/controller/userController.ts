import { Request, Response, NextFunction } from "express";
import { loginUserSchema, option, registerUserSchema } from "../utils/utils";
import { UserInstance } from "../model/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export const Register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const id = uuidv4();

  // Validate with joi
  const validatedInput = registerUserSchema.validate(req.body, option);
  if (validatedInput.error) {
    return res.render("register", { error: validatedInput.error.details[0].message });
  }

  // check if the user already exist
  const user = await UserInstance.findOne({ where: { email: email } });
  if (user) {
    return res.render("register", { error: "Email is already exist" });
  }

  // Hash the password
  const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt());
  req.body.password = passwordHashed;

  // save to database
  const newUser = await UserInstance.create({
    id: id,
    ...req.body,
  });

  return res.redirect("/login");
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // validate with joi
  const validatedInput = loginUserSchema.validate(req.body, option);

  if (validatedInput.error) {
    return res.render("login", { error: validatedInput.error.details[0].message });
  }

  // check if the user exist
  const user = (await UserInstance.findOne({ where: { email: email } })) as unknown as {
    [key: string]: string;
  };
  if (!user) {
    return res.render("login", { error: "Password or Email are incorrect" });
  }

  // Destructure user id and fullname for token
  const { id, fullname } = user;

  // sign for a token that will expires in 30 days
  const token = jwt.sign({ id, fullname }, jwtSecret, { expiresIn: "30d" });

  // Save the token in a cookie
  res.cookie("token", token, {
    maxAge: 3600000, // Cookie expires after 1 hour (in milliseconds)
    httpOnly: true, // Cookie is accessible only via HTTP(S)
  });

  // Authenticate the user password by comparing the hashed one with the user input.
  const validUser = await bcrypt.compare(password, user.password);

  if (!validUser) {
    return res.render("login", { error: "Password or Email are incorrect" });
  }
  return res.redirect("/dashboard");
};
