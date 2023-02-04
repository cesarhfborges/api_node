import db from "../db.js";
import {DataTypes} from "sequelize";
import bcrypt from "bcrypt";

const UserSchema = db.define("users", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            arg: true,
            msg: 'Endereço de e-mail já cadastrado.'
        },
        validate: {
            notNull: {
                arg: true,
                msg: 'Endereço de e-mail não pode ser nulo.'
            },
            notEmpty: {
                arg: true,
                msg: 'Endereço de email não pode estar vázio.'
            },
            isEmail: {
                arg: true,
                msg: 'Favor informar um endereço de email válido.'
            },
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                arg: true,
                msg: 'A senha não pode ser nula.'
            },
            notEmpty: {
                arg: true,
                msg: 'A senha não pode ser vázia.'
            },
        }
    },
}, {
    timestamps: true,
    paranoid: true,
    defaultScope: {
        attributes: {
            exclude: ['deletedAt', 'password']
        }
    },
    hooks: {
        beforeCreate(attributes, options) {
            const salt = bcrypt.genSaltSync();
            attributes.password = bcrypt.hashSync(attributes.password, salt);
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
    },
});

export default UserSchema;
