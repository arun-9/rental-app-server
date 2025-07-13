import { connectToDb } from "../db/connection";
import { getManagerModel } from "../db/models/manager";
import type { IManager } from "../db/models/manager";
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let Manager: IManager | null = null;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // or use your frontend domain
};

export default async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!sequelize) {
      sequelize = await connectToDb();
      Manager = await getManagerModel(sequelize);
    }

    const cognitoId = event.pathParameters?.cognitoId;
    // ✅ Add this log immediately after fetching path parameter
    console.log("Cognito ID received:", cognitoId);
    if (!cognitoId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing cognitoId in path" }),
      };
    }

    const manager = await Manager.findOne({ where: { cognitoId } });

    if (!manager) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Manager not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(manager.toJSON()),
    };
  } catch (error) {
    console.error("Failed to get manager:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to get manager" }),
    };
  }
};
