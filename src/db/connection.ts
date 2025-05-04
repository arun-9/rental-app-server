import { Sequelize } from "sequelize";

const { TIMEOUT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const timeout = Number(TIMEOUT) * 1000;
const URI = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

let sequelize: Sequelize | null = null;

// https://sequelize.org/docs/v6/other-topics/aws-lambda/#tldr
export const connectToDb = async (): Promise<Sequelize> => {
  if (sequelize) {
    sequelize.connectionManager.initPools();

    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      delete sequelize.connectionManager.getConnection;
    }
    return sequelize;
  }

  sequelize = new Sequelize(URI, {
    logging: false,
    pool: {
      min: 0,
      max: 2,
      idle: 0,
      acquire: 3000,
      evict: timeout,
    },
  });
  await sequelize.authenticate();

  return sequelize;
};
