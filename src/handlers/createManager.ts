import { APIGatewayProxyHandler } from "aws-lambda";
import { connectToDb } from "../db/connection";
import { getManagerModel } from "../db/models/Manager";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json"
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { cognitoId, name, email, phoneNumber } = body;

    if (!cognitoId || !name || !email || !phoneNumber) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing required fields." })
      };
    }

    const sequelize = await connectToDb();
    const Manager = await getManagerModel(sequelize);

    const existing = await Manager.findOne({ where: { cognitoId } });
    if (existing) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(existing.toJSON())
      };
    }

    const created = await Manager.create({ cognitoId, name, email, phoneNumber });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(created.toJSON())
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error creating manager",
        error: error.message
      })
    };
  }
};
