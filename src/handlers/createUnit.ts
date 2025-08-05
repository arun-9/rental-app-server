// src/handlers/createUnit.ts
import { connectToDb } from "../db/connection";
import { getUnitModel, Unit } from "../db/models/Unit";
import { getPropertyModel } from "../db/models/Property";
import { getTenantModel } from "../db/models/Tenant";
import { getManagerModel } from "../db/models/Manager";

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

      const ManagerModel = await getManagerModel(sequelize);
      const PropertyModel = await getPropertyModel(sequelize, ManagerModel);
      const TenantModel = await getTenantModel(
        sequelize,
        ManagerModel,
        PropertyModel
      );

      UnitModel = await getUnitModel(
        sequelize,
        PropertyModel,
        TenantModel,
        ManagerModel
      );
    }

    if (!UnitModel) throw new Error("Unit model not initialized");

    const body = event.body ? JSON.parse(event.body) : {};
    const { unitNumber, status, propertyId, tenantId, managerId } = body;

    if (!unitNumber || !status || !propertyId || !managerId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const unit = await UnitModel.create({
      unitNumber,
      status,
      propertyId,
      tenantId: tenantId || null,
      managerId,
    });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(unit.toJSON()),
    };
  } catch (error) {
    console.error("Create unit error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create unit" }),
    };
  }
}
