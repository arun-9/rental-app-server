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

// src/handlers/getTenant.ts
var getTenant_exports = {};
__export(getTenant_exports, {
  default: () => handler
});
module.exports = __toCommonJS(getTenant_exports);

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
var getTenantModel = async (sequelize3, PropertyModel, UnitModel) => {
  if (sequelize3) {
    Tenant.init(
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
        },
        propertyId: {
          type: import_sequelize2.DataTypes.INTEGER,
          allowNull: false
        },
        unitId: {
          type: import_sequelize2.DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize: sequelize3,
        modelName: "tenant",
        timestamps: false
      }
    );
    if (PropertyModel) {
      Tenant.belongsTo(PropertyModel, {
        foreignKey: "propertyId",
        as: "property"
      });
      PropertyModel.hasMany(Tenant, {
        foreignKey: "propertyId",
        as: "tenants"
      });
    }
    if (UnitModel) {
      Tenant.belongsTo(UnitModel, {
        foreignKey: "unitId",
        as: "unit"
      });
      UnitModel.hasOne(Tenant, {
        foreignKey: "unitId",
        as: "tenant"
      });
    }
    await Tenant.sync();
  }
  return Tenant;
};

// src/handlers/getTenant.ts
var sequelize2 = null;
var TenantModel = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
async function handler(event) {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      TenantModel = await getTenantModel(sequelize2);
    }
    if (!TenantModel) {
      throw new Error("Tenant model not initialized");
    }
    const id = event.pathParameters?.id;
    const result = id ? await TenantModel.findByPk(id) : await TenantModel.findAll();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error("Failed to fetch tenant(s):", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch tenant(s)" })
    };
  }
}
//# sourceMappingURL=getTenant.js.map
