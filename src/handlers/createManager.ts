// src/handlers/createManager.ts
import { connectToDb } from "../db/connection";
import { getManagerModel, Manager } from "../db/models/Manager";

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import type { Sequelize } from "sequelize";

let sequelize: Sequelize | null = null;
let ManagerModel: typeof Manager | null = null;

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
      ManagerModel = await getManagerModel(sequelize);
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, phoneNumber, cognitoId } = body;

    if (!name || !email || !phoneNumber || !cognitoId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const created = await ManagerModel!.create({
      name,
      email,
      phoneNumber,
      cognitoId,
    });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(created.toJSON()),
    };
  } catch (error) {
    console.error("Create manager error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create manager" }),
    };
  }
}
