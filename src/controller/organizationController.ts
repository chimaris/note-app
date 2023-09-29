import { Request, Response, NextFunction } from "express";
import { createOrganizationSchema, option } from "../utils/utils";
import { OrganizationInstance } from "../model/organizationModel";
import { uuid } from "uuidv4";

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  // get and validate the user input with joi
  const { organization, employees } = req.body;
  const id = uuid();

  // validate with joi
  const validatedInput = createOrganizationSchema.validate(req.body, option);
  if (validatedInput.error) {
    return res.status(400).json({
      err: validatedInput.error.details[0].message,
    });
  }
  // check if the organization already exist
  const org = await OrganizationInstance.findOne({
    where: { organization: organization },
  });
  if (org) {
    return res.status(401).json({
      message: "Organization already exist",
    });
  }

  // get number of employees
  const noOfEmployees = employees.length;
  // save to database
  const newOrg = await OrganizationInstance.create({ id: id, noOfEmployees, ...req.body });
  // print the result
  return res.status(201).json({
    message: "Created Successfully",
    newOrg,
  });
};

export const getAllOrganization = async (req: Request, res: Response, next: NextFunction) => {
  const allOrg = await OrganizationInstance.findAndCountAll();

  return res.status(200).json({
    message: "Organization Retrieved Successfully",
    count: allOrg.count,
    data: allOrg.rows,
  });
};
