import { connectToDb } from "../db/connection";
import { getPropertyModel } from "../db/models/properties";
import type { IProperties } from "../db/models/properties";
import type { Sequelize } from "sequelize";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

let sequelize: Sequelize | null = null;
let Properties: IProperties | null = null;

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!sequelize) {
    sequelize = await connectToDb();
    Properties = await getPropertyModel(sequelize);
  }
  const foundProperty = await Properties.findByPk(event.pathParameters.id);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(foundProperty.toJSON()),
  };
};
