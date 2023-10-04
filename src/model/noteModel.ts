import { DataTypes, Model, Sequelize } from "sequelize";
import db from "../config/database.config";
import { UserInstance } from "./userModel";

export interface Note {
  id: string;
  Title: string;
  description: string; // string[];
  DueDate: string;
  status: string;
  userId: string;
}

export class NoteInstance extends Model<Note> {}

NoteInstance.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: db, tableName: "organization" }
);

UserInstance.hasMany(NoteInstance, { foreignKey: "userId", as: "user" });
NoteInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "user" });
