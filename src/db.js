import { Sequelize } from "sequelize";
import dotenv from "dotenv/config.js";


const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const debug = process.env.DEBUG === 'true' ? console.log : false;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: "mysql",
    host: dbHost,
    logging: debug,
});

export default sequelize;
