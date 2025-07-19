import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";

// 1. Create the class
class Tenant extends Model {}

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
type ITenant = typeof Tenant;

// 4. Initialization function
export const getTenantModel = async (sequelize?: Sequelize): Promise<ITenant> => {
  if (sequelize) {
    Tenant.init(schema, {
      sequelize,
      modelName: "tenant",
      timestamps: false, // Disable createdAt and updatedAt
    });

    await Tenant.sync(); // Ensure the table is created
  }

  return Tenant;
};

// 5. Export types
export type { ITenant };
