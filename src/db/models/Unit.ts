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
import type { Tenant } from "./Tenant";
import type { Manager } from "./Manager";

class Unit extends Model<
  InferAttributes<Unit>,
  InferCreationAttributes<Unit>
> {
  declare id: CreationOptional<number>;
  declare unitNumber: string;
  declare status: "Vacant" | "Occupied";

  declare propertyId: ForeignKey<Property["id"]>;
  declare tenantId: ForeignKey<Tenant["id"]> | null;
  declare managerId: ForeignKey<Manager["id"]>;

  declare property?: Property;
  declare tenant?: Tenant;
  declare manager?: Manager;
}

export const getUnitModel = async (
  sequelize?: Sequelize,
  PropertyModel?: typeof Property,
  TenantModel?: typeof Tenant,
  ManagerModel?: typeof Manager
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
        status: {
          type: DataTypes.ENUM("Vacant", "Occupied"),
          allowNull: false
        },
        propertyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "properties", key: "id" }
        },
        tenantId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: "tenants", key: "id" }
        },
        managerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "managers", key: "id" }
        }
      },
      {
        sequelize,
        modelName: "unit",
        tableName: "units",
        timestamps: false
      }
    );

    if (PropertyModel) {
      Unit.belongsTo(PropertyModel, { foreignKey: "propertyId", as: "property" });
      PropertyModel.hasMany(Unit, { foreignKey: "propertyId", as: "units" });
    }

    if (TenantModel) {
      Unit.belongsTo(TenantModel, { foreignKey: "tenantId", as: "tenant" });
      TenantModel.hasOne(Unit, { foreignKey: "tenantId", as: "unit" });
    }

    if (ManagerModel) {
      Unit.belongsTo(ManagerModel, { foreignKey: "managerId", as: "manager" });
      ManagerModel.hasMany(Unit, { foreignKey: "managerId", as: "units" });
    }

    await Unit.sync();
  }

  return Unit;
};

export { Unit };
export type IUnit = InferAttributes<Unit>;
