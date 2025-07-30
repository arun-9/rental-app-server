// src/db/models/Property.ts
import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";

class Property extends Model {}

const schema: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfUnits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numberOfTenants: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

type IProperty = typeof Property;

export const getPropertyModel = async (
  sequelize?: Sequelize
): Promise<IProperty> => {
  if (sequelize) {
    Property.init(schema, {
      sequelize,
      modelName: "property",
      timestamps: false,
    });

    await Property.sync();
  }

  return Property;
};

export type { IProperty };
