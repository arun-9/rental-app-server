import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";

// 1. Create the class
class Manager extends Model {}

// 2. Define the schema
const schema: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cognitoId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

// 3. Type alias for the class
type IManager = typeof Manager;

// 4. Initialization function
export const getManagerModel = async (sequelize?: Sequelize): Promise<IManager> => {
  if (sequelize) {
    Manager.init(schema, {
      sequelize,
      modelName: "manager",
      timestamps: false, // Disable createdAt and updatedAt
    });

    await Manager.sync(); // Ensure the table is created
  }

  return Manager;
};

// 5. Export types
export type { IManager };
