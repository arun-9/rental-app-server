// src/db/sequelize.ts
import dotenv from 'dotenv';
dotenv.config(); // This must come before accessing process.env

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_URL!, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
