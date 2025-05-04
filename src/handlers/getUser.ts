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
  const foundUser = await User.findByPk(event.pathParameters.id);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(foundUser.toJSON()),
  };
};
