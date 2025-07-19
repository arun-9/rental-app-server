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

    const body = event.body ? JSON.parse(event.body) : {};

    const createdTenant = await Tenant.create(body, { returning: true });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdTenant.toJSON()),
    };
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create tenant" }),
    };
  }
};
