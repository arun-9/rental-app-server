import { connectToDb } from "../db/connection";
import { getManagerModel } from "../db/models/Manager"; 
import type { IManager } from "../db/models/Manager";
import type { Sequelize } from "sequelize";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

let sequelize: Sequelize | null = null;
let Manager: IManager | null = null;

// CORS headers reused for all responses (still useful even in v2)
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

    const body = event.body ? JSON.parse(event.body) : {};

    const createdManager = await Manager.create(body, { returning: true });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdManager.toJSON()),
    };
  } catch (error) {
    console.error("Failed to create manager:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create manager" }),
    };
  }
};
