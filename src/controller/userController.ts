import { Request, Response, NextFunction } from "express";
import { loginUserSchema, option, registerUserSchema } from "../utils/utils";
import { UserInstance } from "../model/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export const Register = async (req: Request, res: Response, next: NextFunction) => {
  // Get data from req body
  const { email, password } = req.body;
  const id = uuidv4();

  // Validate with joi
  const validatedInput = registerUserSchema.validate(req.body, option);
  if (validatedInput.error) {
    // return res.status(400).json({
    //   message: validatedInput.error.details[0].message,
    // });

    // Render the error on the register page
    return res.render("register", { error: validatedInput.error.details[0].message });
  }

  // check if the user already exist
  const user = await UserInstance.findOne({ where: { email: email } });
  if (user) {
    // return res.status(401).json({
    //   message: "Email is already exist",
    // });

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

  // return res.status(201).json({
  //   message: "Created Successfully",
  //   data: newUser,
  // });
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
  // get req body
  const { email, password } = req.body;

  // validate with joi
  const validatedInput = loginUserSchema.validate(req.body, option);

  if (validatedInput.error) {
    // return res.status(400).json({
    //   message: validatedInput.error.details[0].message,
    // });

    // Render the error on the login page
    return res.render("login", { error: validatedInput.error.details[0].message });
  }

  // check if the user exist
  const user = (await UserInstance.findOne({ where: { email: email } })) as unknown as {
    [key: string]: string;
  };
  if (!user) {
    // return res.status(404).json({
    //   message: "Password or Email are incorrect",
    // });

    // Render the error on the login page
    return res.render("login", { error: "Password or Email are incorrect" });
  }

  // destructure user id for token
  const { id, fullname } = user;

  // sign for a token that will expires in 30 days
  const token = jwt.sign({ id, fullname }, jwtSecret, { expiresIn: "30d" });

  // Set the token in a cookie
  res.cookie("token", token, {
    maxAge: 3600000, // Cookie expires after 1 hour (in milliseconds)
    httpOnly: true, // Cookie is accessible only via HTTP(S)
  });

  // authenticate the user password by comparing the hashed one with the user input.
  const validUser = await bcrypt.compare(password, user.password);

  if (!validUser) {
    // return res.status(404).json({
    //   message: "Incorrect Password..",
    // });

    return res.render("login", { error: "Password or Email are incorrect" });
  }
  return res.redirect("/dashboard");
  // return res.render("dashboard", { token });

  // display user datails
  // return res.status(200).json({
  //   message: "Login Successfully!",
  //   user,
  //   token,
  // });
};
