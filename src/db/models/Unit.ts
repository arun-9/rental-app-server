// src/db/models/Unit.ts
import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";

class Unit extends Model {}

const schema: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  unitNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVacant: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
};

type IUnit = typeof Unit;

export const getUnitModel = async (sequelize?: Sequelize): Promise<IUnit> => {
  if (sequelize) {
    Unit.init(schema, {
      sequelize,
      modelName: "unit",
      timestamps: false,
    });

    await Unit.sync();
  }

  return Unit;
};

export type { IUnit };
