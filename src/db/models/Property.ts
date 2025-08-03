// src/db/models/Property.ts
import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";
import type { IManager } from "./Manager"; // Import the Manager type

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
    references: {
      model: "managers", // must match the table name
      key: "id",
    },
  },
};

type IProperty = typeof Property;

export const getPropertyModel = async (
  sequelize?: Sequelize,
  ManagerModel?: IManager
): Promise<IProperty> => {
  if (sequelize) {
    Property.init(schema, {
      sequelize,
      modelName: "property",
      timestamps: false,
    });

    // Add association
    if (ManagerModel) {
      Property.belongsTo(ManagerModel, {
        foreignKey: "managerId",
        as: "manager",
      });

      ManagerModel.hasMany(Property, {
        foreignKey: "managerId",
        as: "properties",
      });
    }

    await Property.sync();
  }

  return Property;
};

export type { IProperty };
