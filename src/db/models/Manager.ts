// src/db/models/Manager.ts
import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

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

export const getManagerModel = async (
  sequelize?: Sequelize
): Promise<typeof Manager> => {
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
        tableName: "managers",
        timestamps: false,
        comment: "Managers who manage properties, tenants, and units"
      }
    );

    await Manager.sync();
  }

  return Manager;
};

export { Manager };
export type IManager = InferAttributes<Manager>;
