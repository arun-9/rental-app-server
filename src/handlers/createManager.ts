import { connectToDb } from "../db/connection";
import { getManagerModel, Manager } from "../db/models/Manager"; 
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
} from "aws-lambda";

// Singleton for connection
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
    // Initialize Sequelize + Model only once
    if (!sequelize) {
      sequelize = await connectToDb();
      ManagerModel = await getManagerModel(sequelize);
    }

    if (!ManagerModel) throw new Error("Manager model not initialized");

    const body = event.body ? JSON.parse(event.body) : {};
    const createdManager = await ManagerModel.create(body);

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
}
