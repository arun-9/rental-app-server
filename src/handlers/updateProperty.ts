// src/handlers/updateProperty.ts
import { connectToDb } from "../db/connection";
import { getPropertyModel, Property } from "../db/models/Property";
import { getManagerModel } from "../db/models/Manager";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let PropertyModel: typeof Property | null = null;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const sequelize = await connectToDb();
    const ManagerModel = await getManagerModel(sequelize);
    PropertyModel = await getPropertyModel(sequelize, ManagerModel);

    const id = event.pathParameters?.id;
    const updates = event.body ? JSON.parse(event.body) : {};

    if (!id) throw new Error("Property ID is required");

    const property = await PropertyModel.findByPk(id);
    if (!property) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Property not found" }),
      };
    }

    await property.update(updates);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(property.toJSON()),
    };
  } catch (error) {
    console.error("Failed to update property:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to update property" }),
    };
  }
}
