// src/db/models/Unit.ts
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
import type { Tenant } from "./tenant";

// 1. Define the class with typings
class Unit extends Model<
  InferAttributes<Unit>,
  InferCreationAttributes<Unit>
> {
  declare id: CreationOptional<number>;
  declare unitNumber: string;
  declare isVacant: boolean;

  declare propertyId: ForeignKey<Property["id"]>;
  declare tenantId: ForeignKey<Tenant["id"]> | null;

  // Optional association references
  declare property?: Property;
  declare tenant?: Tenant;
}

// 2. Define and initialize the model
export const getUnitModel = async (
  sequelize?: Sequelize,
  PropertyModel?: typeof Property,
  TenantModel?: typeof Tenant
): Promise<typeof Unit> => {
  if (sequelize) {
    Unit.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        unitNumber: {
          type: DataTypes.STRING,
          allowNull: false
        },
        isVacant: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        propertyId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        tenantId: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: "unit",
        timestamps: false
      }
    );

    // 3. Define associations
    if (PropertyModel) {
      Unit.belongsTo(PropertyModel, {
        foreignKey: "propertyId",
        as: "property"
      });

      PropertyModel.hasMany(Unit, {
        foreignKey: "propertyId",
        as: "units"
      });
    }

    if (TenantModel) {
      Unit.belongsTo(TenantModel, {
        foreignKey: "tenantId",
        as: "tenant"
      });

      TenantModel.hasOne(Unit, {
        foreignKey: "tenantId",
        as: "unit"
      });
    }

    await Unit.sync();
  }

  return Unit;
};

// 4. Export model and TS type
export { Unit };
export type IUnit = InferAttributes<Unit>;
