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
  default: () => handler
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

// src/db/models/Property.ts
var import_sequelize3 = require("sequelize");
var Property = class extends import_sequelize3.Model {
};
var getPropertyModel = async (sequelize3, ManagerModel) => {
  if (sequelize3) {
    Property.init(
      {
        id: {
          type: import_sequelize3.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: import_sequelize3.DataTypes.STRING,
          allowNull: false
        },
        address: {
          type: import_sequelize3.DataTypes.STRING,
          allowNull: false
        },
        numberOfUnits: {
          type: import_sequelize3.DataTypes.INTEGER,
          allowNull: false
        },
        numberOfTenants: {
          type: import_sequelize3.DataTypes.INTEGER,
          allowNull: false
        },
        thumbnail: {
          type: import_sequelize3.DataTypes.STRING,
          allowNull: true
        },
        managerId: {
          type: import_sequelize3.DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "managers",
            key: "id"
          }
        }
      },
      {
        sequelize: sequelize3,
        modelName: "property",
        timestamps: false
      }
    );
    if (ManagerModel) {
      Property.belongsTo(ManagerModel, {
        foreignKey: "managerId",
        as: "manager"
      });
      ManagerModel.hasMany(Property, {
        foreignKey: "managerId",
        as: "properties"
      });
    }
    await Property.sync();
  }
  return Property;
};

// src/db/models/Unit.ts
var import_sequelize4 = require("sequelize");
var Unit = class extends import_sequelize4.Model {
};
var getUnitModel = async (sequelize3, PropertyModel, TenantModel2) => {
  if (sequelize3) {
    Unit.init(
      {
        id: {
          type: import_sequelize4.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        unitNumber: {
          type: import_sequelize4.DataTypes.STRING,
          allowNull: false
        },
        isVacant: {
          type: import_sequelize4.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        propertyId: {
          type: import_sequelize4.DataTypes.INTEGER,
          allowNull: false
        },
        tenantId: {
          type: import_sequelize4.DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize: sequelize3,
        modelName: "unit",
        timestamps: false
      }
    );
    if (PropertyModel) {
      Unit.belongsTo(PropertyModel, {
        foreignKey: "propertyId",
        as: "property"
      });
      PropertyModel.hasMany(Unit, {
        foreignKey: "propertyId",
        as: "units"
      });
    }
    if (TenantModel2) {
      Unit.belongsTo(TenantModel2, {
        foreignKey: "tenantId",
        as: "tenant"
      });
      TenantModel2.hasOne(Unit, {
        foreignKey: "tenantId",
        as: "unit"
      });
    }
    await Unit.sync();
  }
  return Unit;
};

// src/handlers/createTenant.ts
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
      const PropertyModel = await getPropertyModel(sequelize2);
      const UnitModel = await getUnitModel(sequelize2, PropertyModel);
      TenantModel = await getTenantModel(sequelize2, PropertyModel, UnitModel);
    }
    if (!TenantModel) throw new Error("Tenant model not initialized");
    const body = event.body ? JSON.parse(event.body) : {};
    const createdTenant = await TenantModel.create(body);
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
}
//# sourceMappingURL=createTenant.js.map
