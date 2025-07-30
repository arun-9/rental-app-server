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

// src/handlers/createUnit.ts
var createUnit_exports = {};
__export(createUnit_exports, {
  default: () => createUnit_default
});
module.exports = __toCommonJS(createUnit_exports);

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

// src/db/models/Unit.ts
var import_sequelize2 = require("sequelize");
var Unit = class extends import_sequelize2.Model {
};
var schema = {
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  unitNumber: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  isVacant: {
    type: import_sequelize2.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  propertyId: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  },
  tenantId: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: true
  }
};
var getUnitModel = async (sequelize3) => {
  if (sequelize3) {
    Unit.init(schema, {
      sequelize: sequelize3,
      modelName: "unit",
      timestamps: false
    });
    await Unit.sync();
  }
  return Unit;
};

// src/handlers/createUnit.ts
var sequelize2 = null;
var Unit2 = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
var createUnit_default = async (event) => {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      Unit2 = await getUnitModel(sequelize2);
    }
    const body = event.body ? JSON.parse(event.body) : {};
    const createdUnit = await Unit2.create(body, { returning: true });
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdUnit.toJSON())
    };
  } catch (error) {
    console.error("Failed to create unit:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create unit" })
    };
  }
};
//# sourceMappingURL=createUnit.js.map
