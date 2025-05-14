import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";
class Properties extends Model {}

const schema: ModelAttributes = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

type IProperties = typeof Properties;
export const getPropertyModel = async (sequelize?: Sequelize): Promise<IProperties> => {
  if (sequelize) {
    Properties.init(schema, { sequelize, modelName: "properties", timestamps: false });
    await Properties.sync();
  }

  return Properties;
};

export type { IProperties };
