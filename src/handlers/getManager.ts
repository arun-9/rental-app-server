// src/handlers/getManager.ts
import { connectToDb } from "../db/connection";
import { getManagerModel } from "../db/models/Manager";
import type { IManager } from "../db/models/Manager";
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let Manager: IManager | null = null;

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
      Manager = await getManagerModel(sequelize);
    }

    const cognitoId = event.pathParameters?.cognitoId;

    const result = cognitoId
      ? await Manager.findOne({ where: { cognitoId } })
      : await Manager.findAll();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Failed to fetch manager(s):", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch manager(s)" }),
    };
  }
};
