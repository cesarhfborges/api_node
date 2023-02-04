import db from "../db.js";
import { Sequelize, INTEGER, STRING } from "sequelize";
import bcrypt from "bcrypt";

const UserSchema = db.define("users", {
    id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: STRING,
        allowNull: false,
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
        // instanceMethods: {
        //     validPassword: (password) => {
        //         return bcrypt.compareSync(password, this.password);
        //     }
        // }
        // beforeCreate: (attributes, options) => {
        //     const salt = bcrypt.genSaltSync();
        //     attributes.password = bcrypt.hashSync(attributes.password, salt);
        // },
        // instanceMethods: {
        //     validPassword: (password) => {
        //         return bcrypt.compareSync(password, this.password);
        //     }
        // }
    }
    // scopes: {
    //     withPassword: {
    //         attributes: { },
    //     }
    // }
}, {
    instanceMethods: {
        verifyPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
});

// UserSchema.beforeCreate((user, options) => {
//     return bcrypt.hash(user.password, 10).then(hash => {
//         user.password = hash;
//     }).catch(err => {
//         throw new Error('Hashing error!')
//     })
// });

export default UserSchema;
