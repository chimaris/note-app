import { Sequelize } from "sequelize";

const db = new Sequelize("app", "", "", {
  storage: "./data/myDb.sqlite",
  dialect: "sqlite",
  logging: false,
});

export default db;
