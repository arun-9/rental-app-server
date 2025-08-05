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

// src/handlers/createManager.ts
var createManager_exports = {};
__export(createManager_exports, {
  default: () => handler
});
module.exports = __toCommonJS(createManager_exports);

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
var getManagerModel = async (sequelize3) => {
  if (sequelize3) {
    Manager.init(
      {
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
      },
      {
        sequelize: sequelize3,
        modelName: "manager",
        tableName: "managers",
        timestamps: false,
        comment: "Managers who manage properties, tenants, and units"
      }
    );
    await Manager.sync();
  }
  return Manager;
};

// src/handlers/createManager.ts
var sequelize2 = null;
var ManagerModel = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
async function handler(event) {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      ManagerModel = await getManagerModel(sequelize2);
    }
    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, phoneNumber, cognitoId } = body;
    if (!name || !email || !phoneNumber || !cognitoId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }
    const created = await ManagerModel.create({
      name,
      email,
      phoneNumber,
      cognitoId
    });
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(created.toJSON())
    };
  } catch (error) {
    console.error("Create manager error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create manager" })
    };
  }
}
//# sourceMappingURL=createManager.js.map
