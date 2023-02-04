import { INTEGER, STRING } from "sequelize";
import db from "../db.js";

export default db.define("client", {
    id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
        unique: true,
    }
}, {
    timestamps: true,
    paranoid: true,
    defaultScope: {
        attributes: {
            exclude: ['deletedAt']
        }
    },
    scopes: {
        withPassword: {
            attributes: { },
        }
    }
});
