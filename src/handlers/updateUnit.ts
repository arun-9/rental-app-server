// src/handlers/updateUnit.ts
import { connectToDb } from "../db/connection";
import { getUnitModel, Unit } from "../db/models/Unit";
import { getPropertyModel } from "../db/models/Property";
import { getTenantModel } from "../db/models/Tenant";

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import type { Sequelize } from "sequelize";

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
      const PropertyModel = await getPropertyModel(sequelize);
      const TenantModel = await getTenantModel(sequelize);
      UnitModel = await getUnitModel(sequelize, PropertyModel, TenantModel);
    }

    if (!UnitModel) throw new Error("Unit model not initialized");

    const unitId = event.pathParameters?.id;
    const body = event.body ? JSON.parse(event.body) : {};

    const unit = await UnitModel.findByPk(unitId);
    if (!unit) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Unit not found" }),
      };
    }

    await unit.update(body);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(unit.toJSON()),
    };
  } catch (error) {
    console.error("Failed to update unit:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to update unit" }),
    };
  }
}
