// src/handlers/createTenant.ts
import { connectToDb } from "../db/connection";
import { getTenantModel, Tenant } from "../db/models/tenant";
import { getPropertyModel } from "../db/models/Property";
import { getUnitModel } from "../db/models/Unit";

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

      // First, load required models for associations
      const PropertyModel = await getPropertyModel(sequelize);
      const UnitModel = await getUnitModel(sequelize, PropertyModel);

      // Now load the Tenant model with associations
      TenantModel = await getTenantModel(sequelize, PropertyModel, UnitModel);
    }

    if (!TenantModel) throw new Error("Tenant model not initialized");

    const body = event.body ? JSON.parse(event.body) : {};

    const createdTenant = await TenantModel.create(body);

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdTenant.toJSON()),
    };
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create tenant" }),
    };
  }
}
