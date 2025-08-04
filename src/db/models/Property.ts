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

// 1. Typed Property class
class Property extends Model<
  InferAttributes<Property>,
  InferCreationAttributes<Property>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare address: string;
  declare numberOfUnits: number;
  declare numberOfTenants: number;
  declare thumbnail: string | null;

  // Foreign key and association
  declare managerId: ForeignKey<Manager["id"]>;
  declare manager?: Manager;
}

// 2. Initialization function
export const getPropertyModel = async (
  sequelize?: Sequelize,
  ManagerModel?: typeof Manager
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
        numberOfUnits: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        numberOfTenants: {
          type: DataTypes.INTEGER,
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
          }
        }
      },
      {
        sequelize,
        modelName: "property",
        timestamps: false
      }
    );

    if (ManagerModel) {
      Property.belongsTo(ManagerModel, {
        foreignKey: "managerId",
        as: "manager"
      });

      ManagerModel.hasMany(Property, {
        foreignKey: "managerId",
        as: "properties"
      });
    }

    await Property.sync();
  }

  return Property;
};

// 3. Type exports
export { Property };
export type IProperty = InferAttributes<Property>;
