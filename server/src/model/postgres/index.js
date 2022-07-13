// eslint-disable-next-line no-unused-vars
import { connection } from '../../core/db/postgres/db.postgres';
// eslint-disable-next-line no-unused-vars
import { mongoose } from '../../core/db/mongodb/db.mongodb';

import { Message } from './Message.postgres';
import { Friend } from './Friend.postgres';
import { User } from './User.postgres';
import { Interest } from './Interest.postgres';

Message.belongsTo(User, {
    as: 'sender',
    foreignKey: 'senderId',
});

Message.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiverId',
});

Friend.belongsTo(User, {
    as: 'sender',
    foreignKey: 'senderId',
});

Friend.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiverId',
});

User.hasMany(Message, {
    as: 'invitations',
    foreignKey: 'receiverId',
});

User.belongsToMany(Interest, {
    through: 'UserInterest',
});

Interest.belongsToMany(User, {
    through: 'UserInterest',
});

export {
    User, Message, Friend, connection,
};

/**
 * want to keep a track of this relations
 * allow you to do
 * const result = await User.findByPk(16, {
 *      include: [
 *          {
 *              model: Message,
 *              as: 'messages',
 *          },
 *      ],
 *  });
 * but ça nous sert a rien
 * */

// User.hasMany(Message, {
//     as: 'messages',
//     foreignKey: 'senderId',
// });

// User.hasMany(Message, {
//     as: 'receivedMessages',
//     foreignKey: 'receiverId',
// });
