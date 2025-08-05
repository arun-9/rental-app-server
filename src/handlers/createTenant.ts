// src/handlers/createTenant.ts
import { connectToDb } from "../db/connection";
import { getTenantModel, Tenant } from "../db/models/Tenant";
import { getManagerModel } from "../db/models/Manager";
import { getPropertyModel } from "../db/models/Property";

import type { Sequelize } from "sequelize";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

let sequelize: Sequelize | null = null;
let TenantModel: typeof Tenant | null = null;

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
      const PropertyModel = await getPropertyModel(sequelize, ManagerModel);
      TenantModel = await getTenantModel(
        sequelize,
        ManagerModel,
        PropertyModel
      );
    }

    if (!TenantModel) throw new Error("Tenant model not initialized");

    const body = event.body ? JSON.parse(event.body) : {};
    const {
      name,
      email,
      phoneNumber,
      profileImage,
      propertyId,
      managerId,
      cognitoId,
    } = body;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !propertyId ||
      !managerId ||
      !cognitoId
    ) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const tenant = await TenantModel.create({
      name,
      email,
      phoneNumber,
      profileImage: profileImage || null,
      propertyId,
      managerId,
      cognitoId,
    });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(tenant.toJSON()),
    };
  } catch (error) {
    console.error("Create tenant error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create tenant" }),
    };
  }
}
