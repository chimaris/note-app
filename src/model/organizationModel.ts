import { DataTypes, Model, Sequelize } from "sequelize";
import db from "../config/database.config";
import { UserInstance } from "./userModel";

export interface Organization {
  id: string;
  organization: string;
  // products: string[];
  marketValue: string;
  address: string;
  ceo: string;
  country: string;
  noOfEmployees: number;
  // employees: string[];
  userId: string;
}

export class OrganizationInstance extends Model<Organization, Organization> {}

OrganizationInstance.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    organization: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // products: {
    //   type: DataTypes.ARRAY(DataTypes.STRING), // Define an array of strings
    //   defaultValue: [], // Set a default empty array if needed
    // },
    marketValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ceo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    noOfEmployees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // employees: {
    //   type: DataTypes.ARRAY(DataTypes.STRING), // Define an array of strings
    //   //   defaultValue: [], // Set a default empty array if needed
    // },
    userId: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: db, tableName: "organization" }
);

UserInstance.hasMany(OrganizationInstance, { foreignKey: "userId", as: "user" });
OrganizationInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "user" });
