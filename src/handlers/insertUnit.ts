import { connectToDb } from "../db/connection";
import { getUnitModel } from "../db/models/units";
import type { IUnits} from "../db/models/units";
import type { Sequelize } from "sequelize";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

let sequelize: Sequelize | null = null;
let Units: IUnits | null = null;

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!sequelize) {
    sequelize = await connectToDb();
    Units = await getUnitModel(sequelize);
  }
  const createdUnit = await Units.create(JSON.parse(event.body), { returning: true });

  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createdUnit.toJSON()),
  };
};
