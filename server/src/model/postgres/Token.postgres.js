import { Model, DataTypes } from 'sequelize';
import { connection } from '../../core/db/postgres/db.postgres';
import { tokenTypes } from '../../utils/Helpers';

class Token extends Model {}

Token.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [Object.values(tokenTypes)],
                    msg: `type must be one of: ${Object.values(tokenTypes)}`,
                },
            },
        },
    },
    {
        sequelize: connection,
        modelName: 'token',
    },
);

export { Token };
