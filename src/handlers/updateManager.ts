// src/handlers/updateManager.ts
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

    if (!ManagerModel) throw new Error("Manager model not initialized");

    const { pathParameters } = event;
    const id = pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Manager ID is required" }),
      };
    }

    const updates = event.body ? JSON.parse(event.body) : {};
    const manager = await ManagerModel.findByPk(id);

    if (!manager) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Manager not found" }),
      };
    }

    await manager.update(updates);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Manager updated successfully",
        updatedManager: manager,
      }),
    };
  } catch (error) {
    console.error("Failed to update manager:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to update manager" }),
    };
  }
}
