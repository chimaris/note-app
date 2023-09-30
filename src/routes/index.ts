import express, { Request, Response, NextFunction } from "express";
var router = express.Router();

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("index", { title: "Express" });
});

router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  res.render("login");
});

router.get("/register", (req: Request, res: Response, next: NextFunction) => {
  res.render("register");
});

export default router;
