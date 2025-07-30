// src/handlers/createUnit.ts
import { connectToDb } from "../db/connection";
import { getUnitModel } from "../db/models/Unit";
import type { IUnit } from "../db/models/Unit";
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let Unit: IUnit | null = null;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!sequelize) {
      sequelize = await connectToDb();
      Unit = await getUnitModel(sequelize);
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const createdUnit = await Unit.create(body, { returning: true });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdUnit.toJSON()),
    };
  } catch (error) {
    console.error("Failed to create unit:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create unit" }),
    };
  }
};
