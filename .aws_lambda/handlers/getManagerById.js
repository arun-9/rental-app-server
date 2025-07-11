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

// src/handlers/getManagerById.ts
var getManagerById_exports = {};
__export(getManagerById_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(getManagerById_exports);

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
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    // ✅ PK as per image
    allowNull: false
  },
  cognitoId: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    // ✅ Unique constraint
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

// src/handlers/getManagerById.ts
var sequelize2 = null;
var Managers2 = null;
var handler = async (event) => {
  if (!sequelize2) {
    sequelize2 = await connectToDb();
    Managers2 = await getManagerModel(sequelize2);
  }
  const { id } = event.pathParameters ?? {};
  if (!id || isNaN(Number(id))) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing or invalid path parameter: id (must be a number)" })
    };
  }
  try {
    const manager = await Managers2.findByPk(Number(id));
    if (!manager) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Manager not found with the given id." })
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manager.toJSON())
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch manager by id",
        error: error.message
      })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=getManagerById.js.map
