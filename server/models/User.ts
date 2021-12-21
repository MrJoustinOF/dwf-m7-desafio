import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

export class User extends Model {}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, modelName: "User" }
);
