// src/handlers/getTenant.ts
import { connectToDb } from "../db/connection";
import { getTenantModel, Tenant } from "../db/models/Tenant"; // Capitalized 'Tenant'
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let TenantModel: typeof Tenant | null = null;

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
      TenantModel = await getTenantModel(sequelize);
    }

    if (!TenantModel) {
      throw new Error("Tenant model not initialized");
    }

    const id = event.pathParameters?.id;
    const result = id
      ? await TenantModel.findByPk(id)
      : await TenantModel.findAll();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Failed to fetch tenant(s):", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch tenant(s)" }),
    };
  }
}
