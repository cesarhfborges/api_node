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
    confirmation: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    refresh: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    paranoid: true,
    defaultScope: {
        attributes: {
            exclude: ['deletedAt', 'password']
        }
    },
    scopes: {
        withPassword: {
            exclude: ['deletedAt']
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
    instanceMethods: {
        validPassword: (password) => {
            return bcrypt.compareSync(password, this.password);
        }
    },
    classMethods: {
        validPassword: (password) => {
            return bcrypt.compareSync(password, this.password);
        }
    }
});

UserSchema.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
}

export default UserSchema;
