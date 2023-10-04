import express, { Request, Response, NextFunction } from "express";
import { createOrganizationSchema, option, updateOrganizationSchema } from "../utils/utils";
import { OrganizationInstance } from "../model/organizationModel";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../middlewares/auth";
import { UserInstance } from "../model/userModel";

var router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const allOrganization = await OrganizationInstance.findAll();
  return res.render("index", { organizations: allOrganization });
});

router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  return res.render("login");
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token");
  return res.redirect("/login");
});

router.get("/register", (req: Request, res: Response, next: NextFunction) => {
  return res.render("register");
});

router.get("/dashboard", auth, async (req: Request | any, res: Response, next: NextFunction) => {
  const { id, fullname } = req.user;
  try {
    const allOrganization = await OrganizationInstance.findAll({
      where: { userId: id },
      include: [{ model: UserInstance, as: "user" }],
    });

    res.render("dashboard", {
      token: req.cookies.token,
      organizations: allOrganization,
      fullname: fullname,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/dashboard", auth, async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const { fullname } = req.user;

    // get and validate the user input with joi
    let { organization, products, employees } = req.body;
    const id = uuidv4();

    // Get user info from middleware auth
    const verified = req.user;

    // validate with joi
    const validatedInput = createOrganizationSchema.validate(req.body, option);

    if (validatedInput.error) {
      return res.render("dashboard", {
        fullname: fullname,
        error: validatedInput.error.details[0].message,
      });
    }

    // check if the organization already exist
    const org = await OrganizationInstance.findOne({
      where: { organization: organization },
    });
    if (org) {
      return res.render("dashboard", { error: "Organization already exist" });
    }

    // Set up user data to fit to database
    const noOfEmployees = employees.length;
    req.body.products = JSON.stringify(products);
    req.body.employees = JSON.stringify(employees);

    // save to database
    const newOrg = await OrganizationInstance.create({
      id: id,
      userId: verified.id,
      ...req.body,
      noOfEmployees,
    });
    if (newOrg) {
      return res.redirect("/dashboard");
    }

    console.log("Didnt create");
  } catch (err) {
    console.log(err);
  }
});

router.patch("/edit/:id", auth, async (req: Request | any, res: Response, next: NextFunction) => {
  const id = req.params.id;
  let { products, employees } = req.body;

  // validate req body with joi
  const validatedInput = updateOrganizationSchema.validate(req.body, option);
  if (validatedInput.error) {
    return res.render("dashboard", { error: validatedInput.error.details[0].message });
  }
  // find the data to update from database and update
  const org = await OrganizationInstance.findOne({ where: { id } });

  if (!org) {
    return res.render("dashboard", { error: "Record not found" });
  }

  // Set up user data to fit to database
  const noOfEmployees = employees.length;
  req.body.products = JSON.stringify(products);
  req.body.employees = JSON.stringify(employees);

  const updated = await org.update({ ...req.body, noOfEmployees });

  if (updated) {
    return res.redirect("/dashboard");
  }
});

router.delete("/delete/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const org = await OrganizationInstance.findOne({ where: { id } });

  if (!org) {
    return res.status(400).json({
      error: "Record not found",
    });
  }

  // DELETE Record
  const deleted = (await org.destroy()) as unknown as { [key: string]: string };

  if (deleted) {
    return res.redirect("/dashboard");
  }
});

router.get("/detail/:id", async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const org = await OrganizationInstance.findOne({ where: { id } });
    if (org) {
      return res.render("detail", { org });
    }
  } catch (err) {
    console.log(err);
  }
});

// Admin details
router.get(
  "/dashboard/detail/:id",
  auth,
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const org = await OrganizationInstance.findOne({ where: { id } });
      if (org) {
        return res.render("adminDetail", { org });
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export default router;
