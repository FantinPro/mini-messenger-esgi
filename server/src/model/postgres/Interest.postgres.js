import { DataTypes, Model } from 'sequelize';
import { connection } from '../../core/db/postgres/db.postgres';

class Interest extends Model {}

Interest.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: connection,
        modelName: 'interest',
    },
);

export { Interest };
