import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

export class Pet extends Model {}

Pet.init(
  {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    found: DataTypes.BOOLEAN,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    refPlace: DataTypes.STRING,
  },
  { sequelize, modelName: "Pet" }
);
