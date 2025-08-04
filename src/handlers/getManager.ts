// src/handlers/getManager.ts
import { connectToDb } from "../db/connection";
import { getManagerModel, Manager } from "../db/models/Manager";
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let ManagerModel: typeof Manager | null = null;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    if (!sequelize) {
      sequelize = await connectToDb();
      ManagerModel = await getManagerModel(sequelize);
    }

    if (!ManagerModel) {
      throw new Error("Manager model not initialized");
    }

    const cognitoId = event.pathParameters?.cognitoId;

    const result = cognitoId
      ? await ManagerModel.findOne({ where: { cognitoId } })
      : await ManagerModel.findAll();

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
}
