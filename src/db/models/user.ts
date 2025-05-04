import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";
class User extends Model {}

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
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};
type IUser = typeof User;
export const getUserModel = async (sequelize?: Sequelize): Promise<IUser> => {
  if (sequelize) {
    User.init(schema, { sequelize, modelName: "user", timestamps: false });
    await User.sync();
  }

  return User;
};

export type { IUser };
