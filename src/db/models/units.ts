import { Sequelize, Model, DataTypes } from "sequelize";
import type { ModelAttributes } from "sequelize";
class Units extends Model {}

const schema: ModelAttributes = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  // This field is `UNIT NO` in the UI
  unitNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
   type: DataTypes.ENUM('vacant', 'occupied'),
    defaultValue: 'vacant'
  },
  // Foreign key
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "properties", 
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
};

type IUnits = typeof Units;
export const getUnitModel = async (sequelize?: Sequelize): Promise<IUnits> => {
  if (sequelize) {
    Units.init(schema, { sequelize, modelName: "units", timestamps: false });
    await Units.sync();
  }

  return Units;
};

export type { IUnits };
