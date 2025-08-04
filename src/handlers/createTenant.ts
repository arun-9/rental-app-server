import { connectToDb } from "../db/connection";
import { getTenantModel, Tenant } from "../db/models/tenant";
import { getPropertyModel } from "../db/models/Property";
import { getUnitModel } from "../db/models/Unit";

import { UniqueConstraintError, ValidationError, Sequelize } from "sequelize";

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

      // Load required models for associations
      const PropertyModel = await getPropertyModel(sequelize);
      const UnitModel = await getUnitModel(sequelize, PropertyModel);
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
  } catch (error: any) {
    console.error("Failed to create tenant:", error);

    if (error instanceof UniqueConstraintError) {
      return {
        statusCode: 409, // Conflict
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Tenant already exists with the provided unique field.",
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        }),
      };
    }

    if (error instanceof ValidationError) {
      return {
        statusCode: 400, // Bad request
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Validation failed.",
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        }),
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create tenant" }),
    };
  }
}
