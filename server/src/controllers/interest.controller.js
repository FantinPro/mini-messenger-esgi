import { Interest } from '../model/postgres/Interest.postgres';

export const getAll = async (req, res, next) => {
    try {
        const interests = await Interest.findAll({});
        res.json(interests);
    } catch (err) {
        next(err);
    }
};
