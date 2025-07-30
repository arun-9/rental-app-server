// src/handlers/getProperty.ts
import { connectToDb } from "../db/connection";
import { getPropertyModel } from "../db/models/Property";
import type { IProperty } from "../db/models/Property";
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let Property: IProperty | null = null;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!sequelize) {
      sequelize = await connectToDb();
      Property = await getPropertyModel(sequelize);
    }

    const id = event.pathParameters?.id;
    const result = id ? await Property.findByPk(id) : await Property.findAll();

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
};
