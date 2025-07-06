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

// src/handlers/insertUnit.ts
var insertUnit_exports = {};
__export(insertUnit_exports, {
  default: () => insertUnit_default
});
module.exports = __toCommonJS(insertUnit_exports);

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

// src/db/models/units.ts
var import_sequelize2 = require("sequelize");
var Units = class extends import_sequelize2.Model {
};
var schema = {
  id: {
    primaryKey: true,
    type: import_sequelize2.DataTypes.INTEGER,
    autoIncrement: true
  },
  // This field is `UNIT NO` in the UI
  unitNumber: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: import_sequelize2.DataTypes.ENUM("vacant", "occupied"),
    defaultValue: "vacant"
  },
  // Foreign key
  propertyId: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "properties",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }
};
var getUnitModel = async (sequelize3) => {
  if (sequelize3) {
    Units.init(schema, { sequelize: sequelize3, modelName: "units", timestamps: false });
    await Units.sync();
  }
  return Units;
};

// src/handlers/insertUnit.ts
var sequelize2 = null;
var Units2 = null;
var insertUnit_default = async (event) => {
  if (!sequelize2) {
    sequelize2 = await connectToDb();
    Units2 = await getUnitModel(sequelize2);
  }
  const createdUnit = await Units2.create(JSON.parse(event.body), { returning: true });
  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createdUnit.toJSON())
  };
};
//# sourceMappingURL=insertUnit.js.map
