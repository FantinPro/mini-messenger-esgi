import { Model, DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { roles } from '../../utils/Helpers';
import { connection } from '../../core/db/postgres/db.postgres';

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [8, 100],
            },
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: roles.ROLE_USER,
        },
    },
    {
        sequelize: connection,
        modelName: 'user',
    },
);

User.addHook('beforeCreate', async (user) => {
    if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password = await bcryptjs.hash(
            user.password,
            await bcryptjs.genSalt(),
        );
    }
});

User.addHook('beforeUpdate', async (user, { fields }) => {
    if (fields.includes('password')) {
        // eslint-disable-next-line no-param-reassign
        user.password = await bcryptjs.hash(
            user.password,
            await bcryptjs.genSalt(),
        );
    }
});

export { User };
