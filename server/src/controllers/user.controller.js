export const getUserByToken = async (req, res, next) => {
    try {
        res.json(req.user);
    } catch (err) {
        next(err);
    }
};
