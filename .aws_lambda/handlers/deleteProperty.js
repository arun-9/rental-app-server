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

// src/handlers/deleteProperty.ts
var deleteProperty_exports = {};
__export(deleteProperty_exports, {
  default: () => handler
});
module.exports = __toCommonJS(deleteProperty_exports);

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
var getPropertyModel = async (sequelize2, ManagerModel, UnitModel, TenantModel) => {
  if (sequelize2) {
    Property.init(
      {
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
        thumbnail: {
          type: import_sequelize2.DataTypes.STRING,
          allowNull: true
        },
        managerId: {
          type: import_sequelize2.DataTypes.INTEGER,
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
        sequelize: sequelize2,
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

// src/db/models/Manager.ts
var import_sequelize3 = require("sequelize");
var Manager = class extends import_sequelize3.Model {
};
var getManagerModel = async (sequelize2) => {
  if (sequelize2) {
    Manager.init(
      {
        id: {
          type: import_sequelize3.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cognitoId: {
          type: import_sequelize3.DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        name: {
          type: import_sequelize3.DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: import_sequelize3.DataTypes.STRING,
          allowNull: false
        },
        phoneNumber: {
          type: import_sequelize3.DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize: sequelize2,
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

// src/handlers/deleteProperty.ts
var PropertyModel = null;
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
async function handler(event) {
  try {
    const sequelize2 = await connectToDb();
    const ManagerModel = await getManagerModel(sequelize2);
    PropertyModel = await getPropertyModel(sequelize2, ManagerModel);
    const id = event.pathParameters?.id;
    if (!id) throw new Error("Property ID is required");
    const property = await PropertyModel.findByPk(id);
    if (!property) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Property not found" })
      };
    }
    await property.destroy();
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to delete property" })
    };
  }
}
//# sourceMappingURL=deleteProperty.js.map
