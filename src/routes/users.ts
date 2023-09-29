import express from "express";
import { Register } from "../controller/userController";

const router = express.Router();

/* GET users listing. */
router.post("/register", Register);

export default router;
