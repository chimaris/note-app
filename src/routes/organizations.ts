import express from "express";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganization,
  updateOrganization,
} from "../controller/organizationController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post("/create", auth, createOrganization);
router.get("/", getAllOrganization);
router.patch("/update/:id", updateOrganization);
router.delete("/delete/:id", deleteOrganization);

export default router;
