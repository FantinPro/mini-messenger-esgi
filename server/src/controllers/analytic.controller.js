import * as analyticService from '../services/analytic.service';

export const stats = async (req, res, next) => {
    try {
        const statsArr = [];

        const countUsersActive = await analyticService.getUsersActive();
        statsArr.push({
            count: countUsersActive,
            text: "Nombres d'utilisateurs confirmés",
            iconName: 'VerifiedUser',
        });

        res.json(statsArr || []);
    } catch (err) {
        next(err);
    }
};
