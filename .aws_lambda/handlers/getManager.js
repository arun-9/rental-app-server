var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/handlers/getManager.ts
var getManager_exports = {};
__export(getManager_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(getManager_exports);

// src/db/connection.ts
var import_sequelize = require("sequelize");
var { TIMEOUT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
var timeout = Number(TIMEOUT) * 1e3;
var URI = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
var sequelize = null;
var connectToDb = async () => {
  if (sequelize) {
    sequelize.connectionManager.initPools();
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      delete sequelize.connectionManager.getConnection;
    }
    return sequelize;
  }
  sequelize = new import_sequelize.Sequelize(URI, {
    logging: false,
    pool: {
      min: 0,
      max: 2,
      idle: 0,
      acquire: 3e3,
      evict: timeout
    }
  });
  await sequelize.authenticate();
  return sequelize;
};

// src/db/models/Manager.ts
var import_sequelize2 = require("sequelize");
var Manager = class extends import_sequelize2.Model {
  id;
  cognitoId;
  name;
  email;
  phoneNumber;
};
var schema = {
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  cognitoId: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  }
};
var getManagerModel = async (sequelize2) => {
  if (sequelize2) {
    Manager.init(schema, {
      sequelize: sequelize2,
      modelName: "managers",
      tableName: "managers",
      timestamps: false
    });
    await Manager.sync();
  }
  return Manager;
};

// src/handlers/getManager.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
};
var handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }
  try {
    const cognitoId = event.pathParameters?.cognitoId;
    console.log("\u{1F9E0} [Lambda] Incoming Cognito ID:", cognitoId);
    if (!cognitoId) {
      console.log("\u{1F6AB} Manager not found for ID:", cognitoId);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing cognitoId in path." })
      };
    }
    const sequelize2 = await connectToDb();
    const Manager2 = await getManagerModel(sequelize2);
    const manager = await Manager2.findOne({ where: { cognitoId } });
    if (!manager) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Manager not found." })
      };
    }
    console.log("\u2705 Found Manager:", manager.toJSON());
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(manager.toJSON())
    };
  } catch (error) {
    console.error("\u274C Error fetching manager:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: `Error fetching manager: ${error.message}` })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=getManager.js.map
