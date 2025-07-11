// src/db/models/Manager.ts
import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";

// Define class extending Sequelize Model
class Manager extends Model {
  public id!: number;
  public cognitoId!: string;
  public name!: string;
  public email!: string;
  public phoneNumber!: string;
}

// Schema definition
const schema: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  cognitoId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
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

// Function to initialize the model with Sequelize instance
export const getManagerModel = async (sequelize?: Sequelize): Promise<typeof Manager> => {
  if (sequelize) {
    Manager.init(schema, {
      sequelize,
      modelName: "managers",
      tableName: "managers",
      timestamps: false,
    });

    await Manager.sync(); // Sync table if it doesn't exist
  }

  return Manager;
};

// Export the model type
export type { Manager };
