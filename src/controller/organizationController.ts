// import { Request, Response, NextFunction } from "express";
// import { createOrganizationSchema, option, updateOrganizationSchema } from "../utils/utils";
// import { OrganizationInstance } from "../model/organizationModel";
// import { v4 as uuidv4 } from "uuid";

// export const createOrganization = async (req: Request | any, res: Response, next: NextFunction) => {
//   // get and validate the user input with joi
//   const { organization } = req.body;
//   const id = uuidv4();

//   // Get user id from middleware auth
//   const verified = req.user;
//   console.log(verified);

//   // validate with joi
//   const validatedInput = createOrganizationSchema.validate(req.body, option);
//   if (validatedInput.error) {
//     return res.status(400).json({
//       err: validatedInput.error.details[0].message,
//     });
//   }
//   // check if the organization already exist
//   const org = await OrganizationInstance.findOne({
//     where: { organization: organization },
//   });
//   if (org) {
//     return res.status(401).json({
//       message: "Organization already exist",
//     });
//   }

//   // get number of employees
//   // const noOfEmployees = employees.length;
//   // save to database
//   const newOrg = await OrganizationInstance.create({
//     id: id,
//     userId: verified.id,
//     //   noOfEmployees,
//     ...req.body,
//   });

//   // print the result
//   return res.status(201).json({
//     message: "Created Successfully",
//     newOrg,
//   });
// };

// export const getAllOrganization = async (req: Request, res: Response, next: NextFunction) => {
//   const allOrg = await OrganizationInstance.findAndCountAll();

//   return res.status(200).json({
//     message: "Organization Retrieved Successfully",
//     count: allOrg.count,
//     data: allOrg.rows,
//   });
// };

// export const updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
//   // get id of the organization to update
//   const id = req.params.id;
//   console.log(id);
//   // validate req body with joi
//   const validatedInput = updateOrganizationSchema.validate(req.body, option);
//   if (validatedInput.error) {
//     return res.status(400).json({
//       err: validatedInput.error.details[0].message,
//     });
//   }
//   // find the data to update from database and update
//   const org = await OrganizationInstance.findOne({ where: { id } });

//   if (!org) {
//     return res.status(400).json({
//       message: "Record not found",
//     });
//   }

//   //const updated1 = { ...org, ...req.body };

//   const updated = await org.update({ ...req.body });
//   // return result
//   return res.status(201).json({
//     message: "Updated Successfully",
//     updated,
//   });
// };

// export const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
//   // get id of the organization to update
//   const { id } = req.params;

//   // find the data to delete from database
//   const org = await OrganizationInstance.findOne({ where: { id } });

//   if (!org) {
//     return res.status(400).json({
//       error: "Record not found",
//     });
//   }

//   // DELETE Record
//   const deletedRecord = await org.destroy();

//   // return result
//   return res.status(201).json({
//     message: "Deleted Successfully",
//     deletedRecord,
//   });
// };
