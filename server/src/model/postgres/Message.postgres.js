import { DataTypes, Model } from 'sequelize';
import { connection } from '../../core/db/postgres/db.postgres';

class Message extends Model {}

Message.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        edited_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'message',
    },
);

export { Message };
