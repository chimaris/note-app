import express, { Request, Response, NextFunction } from "express";
import { createOrganizationSchema, option } from "../utils/utils";
import { OrganizationInstance } from "../model/organizationModel";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../middlewares/auth";

var router = express.Router();

/* GET home page. */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const allOrganization = await OrganizationInstance.findAll();
  console.log(allOrganization);
  res.render("index", { title: "Express", notes: allOrganization[0].dataValues });
});

router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  res.render("login");
});

router.get("/register", (req: Request, res: Response, next: NextFunction) => {
  res.render("register");
});

router.get("/dashboard", async (req: Request, res: Response, next: NextFunction) => {
  const allOrganization = await OrganizationInstance.findAll();
  console.log(allOrganization[0].dataValues);
  res.render("dashboard", { token: req.cookies.token, notes: allOrganization[0].dataValues });
});

router.post("/dashboard", auth, async (req: Request | any, res: Response, next: NextFunction) => {
  // get and validate the user input with joi
  const { organization } = req.body;
  const id = uuidv4();

  console.log("post org");

  // Get user id from middleware auth
  const verified = req.user;

  // validate with joi
  const validatedInput = createOrganizationSchema.validate(req.body, option);
  console.log(validatedInput);

  if (validatedInput.error) {
    return res.render("dashboard", { error: validatedInput.error.details[0].message });
  }

  // check if the organization already exist
  const org = await OrganizationInstance.findOne({
    where: { organization: organization },
  });
  if (org) {
    return res.render("dashboard", { error: "Organization already exist" });
  }

  // get number of employees
  // const noOfEmployees = employees.length;
  // save to database
  const newOrg = await OrganizationInstance.create({
    id: id,
    userId: verified.id,
    //   noOfEmployees,
    ...req.body,
  });

  return res.redirect("dashboard");

  // print the result
  // return res.status(201).json({
  //   message: "Created Successfully",
  //   newOrg,
  // });
});

export default router;
