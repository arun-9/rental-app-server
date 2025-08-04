// src/handlers/createProperty.ts
import { connectToDb } from "../db/connection";
import { getPropertyModel, Property } from "../db/models/Property";
import { getManagerModel } from "../db/models/Manager"; // Needed for associations

import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

// Singleton cache for Sequelize and models
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
    if (!sequelize) {
      sequelize = await connectToDb();
      const ManagerModel = await getManagerModel(sequelize);
      PropertyModel = await getPropertyModel(sequelize, ManagerModel);
    }

    if (!PropertyModel) throw new Error("Property model not initialized");

    const body = event.body ? JSON.parse(event.body) : {};

    const createdProperty = await PropertyModel.create(body);

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdProperty.toJSON()),
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
