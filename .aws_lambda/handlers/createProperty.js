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
  default: () => handler
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

// src/db/models/Manager.ts
var import_sequelize2 = require("sequelize");
var Manager = class extends import_sequelize2.Model {
};
var getManagerModel = async (sequelize3) => {
  if (sequelize3) {
    Manager.init(
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
        }
      },
      {
        sequelize: sequelize3,
        modelName: "manager",
        tableName: "managers",
        timestamps: false,
        comment: "Managers who manage properties, tenants, and units"
      }
    );
    await Manager.sync();
  }
  return Manager;
};

// src/db/models/Property.ts
var import_sequelize3 = require("sequelize");
var Property = class extends import_sequelize3.Model {
};
var getPropertyModel = async (sequelize3, ManagerModel, UnitModel, TenantModel) => {
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
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      },
      {
        sequelize: sequelize3,
        modelName: "property",
        tableName: "properties",
        timestamps: false,
        comment: "Property records managed by managers"
      }
    );
    if (ManagerModel) {
      Property.belongsTo(ManagerModel, {
        foreignKey: "managerId",
        as: "manager",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      ManagerModel.hasMany(Property, {
        foreignKey: "managerId",
        as: "properties",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
    if (UnitModel) {
      Property.hasMany(UnitModel, {
        foreignKey: "propertyId",
        as: "units",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
    if (TenantModel) {
      Property.hasMany(TenantModel, {
        foreignKey: "propertyId",
        as: "tenants",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
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
var getUnitModel = async (sequelize3, PropertyModel2, TenantModel, ManagerModel) => {
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
        status: {
          type: import_sequelize4.DataTypes.ENUM("Vacant", "Occupied"),
          allowNull: false
        },
        propertyId: {
          type: import_sequelize4.DataTypes.INTEGER,
          allowNull: false,
          references: { model: "properties", key: "id" }
        },
        tenantId: {
          type: import_sequelize4.DataTypes.INTEGER,
          allowNull: true,
          references: { model: "tenants", key: "id" }
        },
        managerId: {
          type: import_sequelize4.DataTypes.INTEGER,
          allowNull: false,
          references: { model: "managers", key: "id" }
        }
      },
      {
        sequelize: sequelize3,
        modelName: "unit",
        tableName: "units",
        timestamps: false
      }
    );
    if (PropertyModel2) {
      Unit.belongsTo(PropertyModel2, { foreignKey: "propertyId", as: "property" });
      PropertyModel2.hasMany(Unit, { foreignKey: "propertyId", as: "units" });
    }
    if (TenantModel) {
      Unit.belongsTo(TenantModel, { foreignKey: "tenantId", as: "tenant" });
      TenantModel.hasOne(Unit, { foreignKey: "tenantId", as: "unit" });
    }
    if (ManagerModel) {
      Unit.belongsTo(ManagerModel, { foreignKey: "managerId", as: "manager" });
      ManagerModel.hasMany(Unit, { foreignKey: "managerId", as: "units" });
    }
    await Unit.sync();
  }
  return Unit;
};

// src/db/models/Tenant.ts
var import_sequelize5 = require("sequelize");
var Tenant = class extends import_sequelize5.Model {
};
var getTenantModel = async (sequelize3, ManagerModel, PropertyModel2) => {
  if (sequelize3) {
    Tenant.init(
      {
        id: {
          type: import_sequelize5.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cognitoId: {
          type: import_sequelize5.DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        name: {
          type: import_sequelize5.DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: import_sequelize5.DataTypes.STRING,
          allowNull: false
        },
        phoneNumber: {
          type: import_sequelize5.DataTypes.STRING,
          allowNull: false
        },
        profileImage: {
          type: import_sequelize5.DataTypes.STRING,
          allowNull: true
        },
        managerId: {
          type: import_sequelize5.DataTypes.INTEGER,
          allowNull: false,
          references: { model: "managers", key: "id" }
        },
        propertyId: {
          type: import_sequelize5.DataTypes.INTEGER,
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
    if (PropertyModel2) {
      Tenant.belongsTo(PropertyModel2, { foreignKey: "propertyId", as: "property" });
      PropertyModel2.hasMany(Tenant, { foreignKey: "propertyId", as: "tenants" });
    }
    await Tenant.sync();
  }
  return Tenant;
};

// src/handlers/createProperty.ts
var sequelize2 = null;
var PropertyModel = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
async function handler(event) {
  try {
    if (!sequelize2) {
      sequelize2 = await connectToDb();
      const ManagerModel = await getManagerModel(sequelize2);
      const UnitModel = await getUnitModel(sequelize2);
      const TenantModel = await getTenantModel(sequelize2);
      PropertyModel = await getPropertyModel(sequelize2, ManagerModel, UnitModel, TenantModel);
    }
    if (!PropertyModel) {
      throw new Error("Property model not initialized");
    }
    const body = event.body ? JSON.parse(event.body) : {};
    const { name, address, thumbnail, managerId } = body;
    if (!name || !address || !managerId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields: name, address, managerId" })
      };
    }
    const managerExists = await Manager.findByPk(managerId);
    if (!managerExists) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Manager not found" })
      };
    }
    const newProperty = await PropertyModel.create({
      name,
      address,
      thumbnail: thumbnail || null,
      managerId
    });
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(newProperty.toJSON())
    };
  } catch (error) {
    console.error("Failed to create property:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create property" })
    };
  }
}
//# sourceMappingURL=createProperty.js.map
