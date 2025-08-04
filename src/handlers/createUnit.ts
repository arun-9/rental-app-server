// src/handlers/createUnit.ts
import { connectToDb } from "../db/connection";
import { getUnitModel, Unit } from "../db/models/Unit";
import { getPropertyModel } from "../db/models/Property";
import { getTenantModel } from "../db/models/tenant";

import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let UnitModel: typeof Unit | null = null;

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

      // Initialize dependent models first
      const PropertyModel = await getPropertyModel(sequelize);
      const TenantModel = await getTenantModel(sequelize, PropertyModel);

      // Initialize Unit with associations
      UnitModel = await getUnitModel(sequelize, PropertyModel, TenantModel);
    }

    if (!UnitModel) throw new Error("Unit model not initialized");

    const body = event.body ? JSON.parse(event.body) : {};

    const createdUnit = await UnitModel.create(body);

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdUnit.toJSON()),
    };
  } catch (error) {
    console.error("Failed to create unit:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create unit" }),
    };
  }
}
