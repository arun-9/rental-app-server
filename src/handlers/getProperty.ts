// src/handlers/getProperty.ts
import { connectToDb } from "../db/connection";
import { getPropertyModel, Property } from "../db/models/Property";
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

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
      PropertyModel = await getPropertyModel(sequelize);
    }

    if (!PropertyModel) {
      throw new Error("Property model not initialized");
    }

    const id = event.pathParameters?.id;
    const result = id
      ? await PropertyModel.findByPk(id)
      : await PropertyModel.findAll();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Failed to fetch property(ies):", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch property(ies)" }),
    };
  }
}
