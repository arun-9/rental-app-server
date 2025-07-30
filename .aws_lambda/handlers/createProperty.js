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

// src/handlers/createProperty.ts
var createProperty_exports = {};
__export(createProperty_exports, {
  default: () => createProperty_default
});
module.exports = __toCommonJS(createProperty_exports);

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

// src/db/models/Property.ts
var import_sequelize2 = require("sequelize");
var Property = class extends import_sequelize2.Model {
};
var schema = {
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  numberOfUnits: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  },
  numberOfTenants: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  },
  thumbnail: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: true
  },
  managerId: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  }
};
var getPropertyModel = async (sequelize3) => {
  if (sequelize3) {
    Property.init(schema, {
      sequelize: sequelize3,
      modelName: "property",
      timestamps: false
    });
    await Property.sync();
  }
  return Property;
};

// src/handlers/createProperty.ts
var sequelize2 = null;
var Property2 = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
var createProperty_default = async (event) => {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      Property2 = await getPropertyModel(sequelize2);
    }
    const body = event.body ? JSON.parse(event.body) : {};
    const createdProperty = await Property2.create(body, { returning: true });
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(createdProperty.toJSON())
    };
  } catch (error) {
    console.error("Failed to create property:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create property" })
    };
  }
};
//# sourceMappingURL=createProperty.js.map
