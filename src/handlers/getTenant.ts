import { connectToDb } from "../db/connection";
import { getTenantModel } from "../db/models/tenant";
import type { ITenant } from "../db/models/tenant";
import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let Tenant: ITenant | null = null;

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
      Tenant = await getTenantModel(sequelize);
    }

    const cognitoId = event.pathParameters?.cognitoId;
    console.log("Cognito ID received:", cognitoId);

    if (!cognitoId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing cognitoId in path" }),
      };
    }

    const tenant = await Tenant.findOne({ where: { cognitoId } });

    if (!tenant) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Tenant not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(tenant.toJSON()),
    };
  } catch (error) {
    console.error("Failed to get tenant:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to get tenant" }),
    };
  }
};
