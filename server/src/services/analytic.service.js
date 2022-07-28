import { User } from '../model/postgres/index';

export const getUsersActive = () => User.count({
    where: {
        active: true,
    },
});
