// src/db/models/Property.ts
import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from "sequelize";

import type { Manager } from "./Manager";
import type { Unit } from "./Unit";
import type { Tenant } from "./tenant";

// 1. Typed Property class
class Property extends Model<
  InferAttributes<Property>,
  InferCreationAttributes<Property>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare address: string;
  declare thumbnail: string | null;

  declare managerId: ForeignKey<Manager["id"]>;

  declare manager?: Manager;
  declare units?: Unit[];
  declare tenants?: Tenant[];
}

// 2. Initialization function
export const getPropertyModel = async (
  sequelize?: Sequelize,
  ManagerModel?: typeof Manager,
  UnitModel?: typeof Unit,
  TenantModel?: typeof Tenant
): Promise<typeof Property> => {
  if (sequelize) {
    Property.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false
        },
        thumbnail: {
          type: DataTypes.STRING,
          allowNull: true
        },
        managerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "managers",
            key: "id"
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      },
      {
        sequelize,
        modelName: "property",
        tableName: "properties",
        timestamps: false,
        comment: "Property records managed by managers"
      }
    );

    // Associations
    if (ManagerModel) {
      Property.belongsTo(ManagerModel, {
        foreignKey: "managerId",
        as: "manager",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });

      ManagerModel.hasMany(Property, {
        foreignKey: "managerId",
        as: "properties",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }

    if (UnitModel) {
      Property.hasMany(UnitModel, {
        foreignKey: "propertyId",
        as: "units",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }

    if (TenantModel) {
      Property.hasMany(TenantModel, {
        foreignKey: "propertyId",
        as: "tenants",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }

    await Property.sync(); // Avoid this in production or use conditionally
  }

  return Property;
};

// 3. Type exports
export { Property };
export type IProperty = InferAttributes<Property>;
