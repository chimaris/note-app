import express from "express";
import { createOrganization, getAllOrganization } from "../controller/organizationController";

const router = express.Router();

router.post("/create", createOrganization);
router.get("/", getAllOrganization);

export default router;
