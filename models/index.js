const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

const defineUser = require("./User");
const defineTask = require("./Task");

const User = defineUser(sequelize);
const Task = defineTask(sequelize);

User.hasMany(Task, { foreignKey: "user_id" });
Task.belongsTo(User, { foreignKey: "user_id" });

module.exports = { sequelize, User, Task };