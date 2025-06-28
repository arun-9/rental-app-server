import { connectToDb } from "../db/connection";
import { getManagerModel } from "../db/models/managers";
import { getPropertyModel } from "../db/models/properties";
import type { IProperties } from "../db/models/properties";
import type { Sequelize } from "sequelize";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

let sequelize: Sequelize | null = null;
let Properties: IProperties | null = null;

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const managerId = event.pathParameters?.managerId;

  if (!managerId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing managerId in path." }),
    };
  }

  if (!sequelize) {
    sequelize = await connectToDb();
    await getManagerModel(sequelize);
    Properties = await getPropertyModel(sequelize);
  }

  try {
    const foundProperties = await Properties.findAll({
      where: { managerId },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foundProperties),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch properties", details: err.message }),
    };
  }
};
