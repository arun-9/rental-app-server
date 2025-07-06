import { connectToDb } from "../db/connection";
import { getManagerModel } from "../db/models/managers";
import type { IManagers } from "../db/models/managers";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { Sequelize } from "sequelize";
import { validate as isUuid } from "uuid";

let sequelize: Sequelize | null = null;
let Managers: IManagers | null = null;

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!sequelize) {
    sequelize = await connectToDb();
    Managers = await getManagerModel(sequelize);
  }

  const body = JSON.parse(event.body ?? "{}");
  const { managerId } = body;

  if (!managerId || !isUuid(managerId)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid or missing managerId (must be a UUID)." }),
    };
  }

  try {
    const existing = await Managers.findByPk(managerId);
    if (existing) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Manager already exists with this managerId." }),
      };
    }

    const createdManager = await Managers.create({ managerId });

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createdManager.toJSON()),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to insert manager", error: error.message }),
    };
  }
};
