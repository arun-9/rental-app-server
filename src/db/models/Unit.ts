// src/db/models/Unit.ts
import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";
import type { IProperty } from "./Property";
import type { ITenant } from "./tenant"; // import types

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

export const getUnitModel = async (
  sequelize?: Sequelize,
  PropertyModel?: IProperty,
  TenantModel?: ITenant
): Promise<IUnit> => {
  if (sequelize) {
    Unit.init(schema, {
      sequelize,
      modelName: "unit",
      timestamps: false,
    });

    // Add associations
    if (PropertyModel) {
      Unit.belongsTo(PropertyModel, {
        foreignKey: "propertyId",
        as: "property",
      });

      PropertyModel.hasMany(Unit, {
        foreignKey: "propertyId",
        as: "units",
      });
    }

    if (TenantModel) {
      Unit.belongsTo(TenantModel, {
        foreignKey: "tenantId",
        as: "tenant",
      });

      TenantModel.hasOne(Unit, {
        foreignKey: "tenantId",
        as: "unit",
      });
    }

    await Unit.sync();
  }

  return Unit;
};

export type { IUnit };
