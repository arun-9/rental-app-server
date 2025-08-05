// src/handlers/updateTenant.ts
import { connectToDb } from "../db/connection";
import { getTenantModel, Tenant } from "../db/models/Tenant";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import type { Sequelize } from "sequelize";

let sequelize: Sequelize | null = null;
let TenantModel: typeof Tenant | null = null;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async function updateTenantHandler(
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
        body: JSON.stringify({ error: "Missing tenant ID" }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const [affectedRows] = await TenantModel.update(body, {
      where: { id: tenantId },
    });

    if (affectedRows === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Tenant not found" }),
      };
    }

    const updatedTenant = await TenantModel.findByPk(tenantId);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(updatedTenant?.toJSON()),
    };
  } catch (error) {
    console.error("Failed to update tenant:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to update tenant" }),
    };
  }
}
