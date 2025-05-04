import { connectToDb } from "../db/connection";
import { getUserModel } from "../db/models/user";
import type { IUser } from "../db/models/user";
import type { Sequelize } from "sequelize";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

let sequelize: Sequelize | null = null;
let User: IUser | null = null;

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!sequelize) {
    sequelize = await connectToDb();
    User = await getUserModel(sequelize);
  }

  const createdUser = await User.create(JSON.parse(event.body), { returning: true });

  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createdUser.toJSON()),
  };
};
