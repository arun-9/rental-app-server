// src/handlers/createProperty.ts
import { connectToDb } from "../db/connection";
import { getManagerModel, Manager } from "../db/models/Manager";
import { getPropertyModel, Property } from "../db/models/Property";
import { getUnitModel } from "../db/models/Unit";
import { getTenantModel } from "../db/models/Tenant";

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import type { Sequelize } from "sequelize";

let sequelize: Sequelize | null = null;
let PropertyModel: typeof Property | null = null;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    // Initialize Sequelize and models once
    if (!sequelize) {
      sequelize = await connectToDb();

      const ManagerModel = await getManagerModel(sequelize);
      const UnitModel = await getUnitModel(sequelize);
      const TenantModel = await getTenantModel(sequelize);

      PropertyModel = await getPropertyModel(sequelize, ManagerModel, UnitModel, TenantModel);
    }

    if (!PropertyModel) {
      throw new Error("Property model not initialized");
    }

    // Parse and validate request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { name, address, thumbnail, managerId } = body;

    if (!name || !address || !managerId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields: name, address, managerId" }),
      };
    }

    // Optional: verify manager exists
    const managerExists = await Manager.findByPk(managerId);
    if (!managerExists) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Manager not found" }),
      };
    }

    // Create new property
    const newProperty = await PropertyModel.create({
      name,
      address,
      thumbnail: thumbnail || null,
      managerId,
    });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(newProperty.toJSON()),
    };
  } catch (error) {
    console.error("Failed to create property:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create property" }),
    };
  }
}
