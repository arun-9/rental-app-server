// src/db/models/Tenant.ts
import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from "sequelize";

import type { Property } from "./Property";
import type { Unit } from "./Unit";

// 1. Typed Tenant model class
class Tenant extends Model<
  InferAttributes<Tenant>,
  InferCreationAttributes<Tenant>
> {
  declare id: CreationOptional<number>;
  declare cognitoId: string;
  declare name: string;
  declare email: string;
  declare phoneNumber: string;

  declare propertyId: ForeignKey<Property["id"]>;
  declare unitId: ForeignKey<Unit["id"]> | null;

  // Optional association references
  declare property?: Property;
  declare unit?: Unit;
}

// 2. Init function with associations
export const getTenantModel = async (
  sequelize?: Sequelize,
  PropertyModel?: typeof Property,
  UnitModel?: typeof Unit
): Promise<typeof Tenant> => {
  if (sequelize) {
    Tenant.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cognitoId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false
        },
        propertyId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        unitId: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: "tenant",
        timestamps: false
      }
    );

    // Associations
    if (PropertyModel) {
      Tenant.belongsTo(PropertyModel, {
        foreignKey: "propertyId",
        as: "property"
      });
      PropertyModel.hasMany(Tenant, {
        foreignKey: "propertyId",
        as: "tenants"
      });
    }

    if (UnitModel) {
      Tenant.belongsTo(UnitModel, {
        foreignKey: "unitId",
        as: "unit"
      });
      UnitModel.hasOne(Tenant, {
        foreignKey: "unitId",
        as: "tenant"
      });
    }

    await Tenant.sync();
  }

  return Tenant;
};

// 3. Export class and type
export { Tenant };
export type ITenant = InferAttributes<Tenant>;
