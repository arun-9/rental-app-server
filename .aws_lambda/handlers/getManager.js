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
  default: () => getManager_default
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
};
var schema = {
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cognitoId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false,
    unique: true
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
var getManagerModel = async (sequelize3) => {
  if (sequelize3) {
    Manager.init(schema, {
      sequelize: sequelize3,
      modelName: "manager",
      timestamps: false
      // Disable createdAt and updatedAt
    });
    await Manager.sync();
  }
  return Manager;
};

// src/handlers/getManager.ts
var sequelize2 = null;
var Manager2 = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
var getManager_default = async (event) => {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      Manager2 = await getManagerModel(sequelize2);
    }
    const cognitoId = event.pathParameters?.cognitoId;
    const result = cognitoId ? await Manager2.findOne({ where: { cognitoId } }) : await Manager2.findAll();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error("Failed to fetch manager(s):", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch manager(s)" })
    };
  }
};
//# sourceMappingURL=getManager.js.map
