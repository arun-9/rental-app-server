import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";

class Managers extends Model {}

const schema: ModelAttributes = {
  managerId: {
    type: DataTypes.UUID,
    primaryKey: true,        // ✅ Primary Key is managerId
    allowNull: false,
  },
  // Optional id field, not PK
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
