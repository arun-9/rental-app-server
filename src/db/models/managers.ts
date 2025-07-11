import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";

class Managers extends Model {}

const schema: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // ✅ PK as per image
    allowNull: false,
  },
  cognitoId: {
    type: DataTypes.STRING,
    unique: true,      // ✅ Unique constraint
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

type IManagers = typeof Managers;

export const getManagerModel = async (sequelize?: Sequelize): Promise<IManagers> => {
  if (sequelize) {
    Managers.init(schema, {
      sequelize,
      modelName: "managers",
      tableName: "managers",
      timestamps: false,
    });
    await Managers.sync();
  }

  return Managers;
};

export type { IManagers };
