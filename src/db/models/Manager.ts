// src/db/models/Manager.ts
import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

// 1. Strongly typed Manager class
class Manager extends Model<
  InferAttributes<Manager>,
  InferCreationAttributes<Manager>
> {
  declare id: CreationOptional<number>;
  declare cognitoId: string;
  declare name: string;
  declare email: string;
  declare phoneNumber: string;
}

// 2. Schema is now optional, since Model class already declares fields
export const getManagerModel = async (sequelize?: Sequelize) => {
  if (sequelize) {
    Manager.init(
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
        }
      },
      {
        sequelize,
        modelName: "manager",
        timestamps: false
      }
    );

    await Manager.sync();
  }

  return Manager;
};

// 3. Type exports
export { Manager }; // ← class itself
export type IManager = InferAttributes<Manager>;
