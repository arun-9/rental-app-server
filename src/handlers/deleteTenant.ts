// src/handlers/deleteTenant.ts
import { connectToDb } from "../db/connection";
import { getTenantModel, Tenant } from "../db/models/Tenant";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import type { Sequelize } from "sequelize";

// Define CORS headers
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

let sequelize: Sequelize | null = null;
let TenantModel: typeof Tenant | null = null;

export async function deleteTenantHandler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    if (!sequelize) {
      sequelize = await connectToDb();
      TenantModel = await getTenantModel(sequelize);
    }

    if (!TenantModel) throw new Error("Tenant model not initialized");

    const tenantId = event.pathParameters?.id;
    if (!tenantId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing tenant ID" })
      };
    }

    const deleted = await TenantModel.destroy({ where: { id: tenantId } });

    if (deleted === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Tenant not found" })
      };
    }

    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  } catch (error) {
    console.error("Failed to delete tenant:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to delete tenant" })
    };
  }
}