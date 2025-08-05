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

// src/handlers/deleteTenant.ts
var deleteTenant_exports = {};
__export(deleteTenant_exports, {
  deleteTenantHandler: () => deleteTenantHandler
});
module.exports = __toCommonJS(deleteTenant_exports);

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

// src/db/models/Tenant.ts
var import_sequelize2 = require("sequelize");
var Tenant = class extends import_sequelize2.Model {
};
var getTenantModel = async (sequelize3, ManagerModel, PropertyModel) => {
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
        profileImage: {
          type: import_sequelize2.DataTypes.STRING,
          allowNull: true
        },
        managerId: {
          type: import_sequelize2.DataTypes.INTEGER,
          allowNull: false,
          references: { model: "managers", key: "id" }
        },
        propertyId: {
          type: import_sequelize2.DataTypes.INTEGER,
          allowNull: false,
          references: { model: "properties", key: "id" }
        }
      },
      {
        sequelize: sequelize3,
        modelName: "tenant",
        tableName: "tenants",
        timestamps: false
      }
    );
    if (ManagerModel) {
      Tenant.belongsTo(ManagerModel, { foreignKey: "managerId", as: "manager" });
      ManagerModel.hasMany(Tenant, { foreignKey: "managerId", as: "tenants" });
    }
    if (PropertyModel) {
      Tenant.belongsTo(PropertyModel, { foreignKey: "propertyId", as: "property" });
      PropertyModel.hasMany(Tenant, { foreignKey: "propertyId", as: "tenants" });
    }
    await Tenant.sync();
  }
  return Tenant;
};

// src/handlers/deleteTenant.ts
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
var sequelize2 = null;
var TenantModel = null;
async function deleteTenantHandler(event) {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      TenantModel = await getTenantModel(sequelize2);
    }
    if (!TenantModel) throw new Error("Tenant model not initialized");
    const tenantId = event.pathParameters?.id;
    if (!tenantId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing tenant ID" })
      };
    }
    const deleted = await TenantModel.destroy({ where: { id: tenantId } });
    if (deleted === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Tenant not found" })
      };
    }
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  } catch (error) {
    console.error("Failed to delete tenant:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to delete tenant" })
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteTenantHandler
});
//# sourceMappingURL=deleteTenant.js.map
