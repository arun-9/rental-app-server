// src/handlers/getUnit.ts
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

    const id = event.pathParameters?.id;
    const result = id ? await Unit.findByPk(id) : await Unit.findAll();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Failed to fetch unit(s):", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch unit(s)" }),
    };
  }
};
