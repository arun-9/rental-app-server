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

// src/handlers/createTenant.ts
var createTenant_exports = {};
__export(createTenant_exports, {
  default: () => createTenant_default
});
module.exports = __toCommonJS(createTenant_exports);

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

// src/db/models/tenant.ts
var import_sequelize2 = require("sequelize");
var Tenant = class extends import_sequelize2.Model {
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
  },
  propertyId: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  },
  unitId: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: true
  }
};
var getTenantModel = async (sequelize3) => {
  if (sequelize3) {
    Tenant.init(schema, {
      sequelize: sequelize3,
      modelName: "tenant",
      timestamps: false
    });
    await Tenant.sync();
  }
  return Tenant;
};

// src/handlers/createTenant.ts
var sequelize2 = null;
var Tenant2 = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
var createTenant_default = async (event) => {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      Tenant2 = await getTenantModel(sequelize2);
    }
    const body = event.body ? JSON.parse(event.body) : {};
    const createdTenant = await Tenant2.create(body, { returning: true });
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdTenant.toJSON())
    };
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create tenant" })
    };
  }
};
//# sourceMappingURL=createTenant.js.map
