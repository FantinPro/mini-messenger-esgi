import { StatusCodes } from 'http-status-codes';
import { Op, Model, DataTypes } from 'sequelize';
import { connection } from '../../core/db/postgres/db.postgres';
import { ApiError } from '../../utils/ApiError';
import { friendsStatus } from '../../utils/Helpers';

class Friend extends Model {}

Friend.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: {
                    args: [Object.values(friendsStatus)],
                    msg: `Status must be one of: ${Object.values(friendsStatus)}`,
                },
            },
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'friend',
    },
);

Friend.addHook('beforeCreate', (friend, options) => Friend.findOne({
    where: {
        [Op.or]: [
            {
                senderId: friend.senderId,
                receiverId: friend.receiverId,
            },
            {
                senderId: friend.receiverId,
                receiverId: friend.senderId,
            },
        ],
    },
}).then((result) => {
    if (result) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'friend already exists');
    }
}));

export { Friend };
