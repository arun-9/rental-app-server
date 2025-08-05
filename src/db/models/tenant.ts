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
import type { Manager } from "./Manager";

class Tenant extends Model<
  InferAttributes<Tenant>,
  InferCreationAttributes<Tenant>
> {
  declare id: CreationOptional<number>;
  declare cognitoId: string;
  declare name: string;
  declare email: string;
  declare phoneNumber: string;
  declare profileImage: string | null;

  declare managerId: ForeignKey<Manager["id"]>;
  declare propertyId: ForeignKey<Property["id"]>;

  declare manager?: Manager;
  declare property?: Property;
}

export const getTenantModel = async (
  sequelize?: Sequelize,
  ManagerModel?: typeof Manager,
  PropertyModel?: typeof Property
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
        profileImage: {
          type: DataTypes.STRING,
          allowNull: true
        },
        managerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "managers", key: "id" }
        },
        propertyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "properties", key: "id" }
        }
      },
      {
        sequelize,
        modelName: "tenant",
        tableName: "tenants",
        timestamps: false
      }
    );

    if (ManagerModel) {
      Tenant.belongsTo(ManagerModel, { foreignKey: "managerId", as: "manager" });
      ManagerModel.hasMany(Tenant, { foreignKey: "managerId", as: "tenants" });
    }

    if (PropertyModel) {
      Tenant.belongsTo(PropertyModel, { foreignKey: "propertyId", as: "property" });
      PropertyModel.hasMany(Tenant, { foreignKey: "propertyId", as: "tenants" });
    }

    await Tenant.sync();
  }

  return Tenant;
};

export { Tenant };
export type ITenant = InferAttributes<Tenant>;
