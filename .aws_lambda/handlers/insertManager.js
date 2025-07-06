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

// src/handlers/insertManager.ts
var insertManager_exports = {};
__export(insertManager_exports, {
  default: () => insertManager_default
});
module.exports = __toCommonJS(insertManager_exports);

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

// src/db/models/managers.ts
var import_sequelize2 = require("sequelize");
var Managers = class extends import_sequelize2.Model {
};
var schema = {
  managerId: {
    type: import_sequelize2.DataTypes.UUID,
    primaryKey: true,
    // ✅ Primary Key is managerId
    allowNull: false
  },
  // Optional id field, not PK
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  }
};
var getManagerModel = async (sequelize3) => {
  if (sequelize3) {
    Managers.init(schema, {
      sequelize: sequelize3,
      modelName: "managers",
      tableName: "managers",
      timestamps: false
    });
    await Managers.sync();
  }
  return Managers;
};

// src/handlers/insertManager.ts
var import_uuid = require("uuid");
var sequelize2 = null;
var Managers2 = null;
var insertManager_default = async (event) => {
  if (!sequelize2) {
    sequelize2 = await connectToDb();
    Managers2 = await getManagerModel(sequelize2);
  }
  const body = JSON.parse(event.body ?? "{}");
  const { managerId } = body;
  if (!managerId || !(0, import_uuid.validate)(managerId)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid or missing managerId (must be a UUID)." })
    };
  }
  try {
    const existing = await Managers2.findByPk(managerId);
    if (existing) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Manager already exists with this managerId." })
      };
    }
    const createdManager = await Managers2.create({ managerId });
    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createdManager.toJSON())
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to insert manager", error: error.message })
    };
  }
};
//# sourceMappingURL=insertManager.js.map
