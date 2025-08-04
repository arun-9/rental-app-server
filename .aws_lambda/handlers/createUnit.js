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
  default: () => handler
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
var getUnitModel = async (sequelize3, PropertyModel, TenantModel) => {
  if (sequelize3) {
    Unit.init(
      {
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
    if (TenantModel) {
      Unit.belongsTo(TenantModel, {
        foreignKey: "tenantId",
        as: "tenant"
      });
      TenantModel.hasOne(Unit, {
        foreignKey: "tenantId",
        as: "unit"
      });
    }
    await Unit.sync();
  }
  return Unit;
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

// src/db/models/tenant.ts
var import_sequelize4 = require("sequelize");
var Tenant = class extends import_sequelize4.Model {
};
var getTenantModel = async (sequelize3, PropertyModel, UnitModel2) => {
  if (sequelize3) {
    Tenant.init(
      {
        id: {
          type: import_sequelize4.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cognitoId: {
          type: import_sequelize4.DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        name: {
          type: import_sequelize4.DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: import_sequelize4.DataTypes.STRING,
          allowNull: false
        },
        phoneNumber: {
          type: import_sequelize4.DataTypes.STRING,
          allowNull: false
        },
        propertyId: {
          type: import_sequelize4.DataTypes.INTEGER,
          allowNull: false
        },
        unitId: {
          type: import_sequelize4.DataTypes.INTEGER,
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
    if (UnitModel2) {
      Tenant.belongsTo(UnitModel2, {
        foreignKey: "unitId",
        as: "unit"
      });
      UnitModel2.hasOne(Tenant, {
        foreignKey: "unitId",
        as: "tenant"
      });
    }
    await Tenant.sync();
  }
  return Tenant;
};

// src/handlers/createUnit.ts
var sequelize2 = null;
var UnitModel = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
async function handler(event) {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      const PropertyModel = await getPropertyModel(sequelize2);
      const TenantModel = await getTenantModel(sequelize2, PropertyModel);
      UnitModel = await getUnitModel(sequelize2, PropertyModel, TenantModel);
    }
    if (!UnitModel) throw new Error("Unit model not initialized");
    const body = event.body ? JSON.parse(event.body) : {};
    const createdUnit = await UnitModel.create(body);
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
}
//# sourceMappingURL=createUnit.js.map
