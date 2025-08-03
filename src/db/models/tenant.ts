// src/db/models/Tenant.ts
import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";
import type { IProperty } from "./Property";
import type { IUnit } from "./Unit";

class Tenant extends Model {}

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
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
};

type ITenant = typeof Tenant;

export const getTenantModel = async (
  sequelize?: Sequelize,
  PropertyModel?: IProperty,
  UnitModel?: IUnit
): Promise<ITenant> => {
  if (sequelize) {
    Tenant.init(schema, {
      sequelize,
      modelName: "tenant",
      timestamps: false,
    });

    // Relationship: Tenant belongs to Property
    if (PropertyModel) {
      Tenant.belongsTo(PropertyModel, {
        foreignKey: "propertyId",
        as: "property",
      });

      PropertyModel.hasMany(Tenant, {
        foreignKey: "propertyId",
        as: "tenants",
      });
    }

    // Relationship: Tenant belongs to Unit
    if (UnitModel) {
      Tenant.belongsTo(UnitModel, {
        foreignKey: "unitId",
        as: "unit",
      });

      UnitModel.hasOne(Tenant, {
        foreignKey: "unitId",
        as: "tenant",
      });
    }

    await Tenant.sync();
  }

  return Tenant;
};

export type { ITenant };
