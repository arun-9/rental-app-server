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

// src/handlers/insertUser.ts
var insertUser_exports = {};
__export(insertUser_exports, {
  default: () => insertUser_default
});
module.exports = __toCommonJS(insertUser_exports);

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

// src/db/models/user.ts
var import_sequelize2 = require("sequelize");
var User = class extends import_sequelize2.Model {
};
var schema = {
  id: {
    primaryKey: true,
    type: import_sequelize2.DataTypes.INTEGER,
    autoIncrement: true
  },
  name: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  }
};
var getUserModel = async (sequelize3) => {
  if (sequelize3) {
    User.init(schema, { sequelize: sequelize3, modelName: "user", timestamps: false });
    await User.sync();
  }
  return User;
};

// src/handlers/insertUser.ts
var sequelize2 = null;
var User2 = null;
var insertUser_default = async (event) => {
  if (!sequelize2) {
    sequelize2 = await connectToDb();
    User2 = await getUserModel(sequelize2);
  }
  const createdUser = await User2.create(JSON.parse(event.body), { returning: true });
  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createdUser.toJSON())
  };
};
//# sourceMappingURL=insertUser.js.map
