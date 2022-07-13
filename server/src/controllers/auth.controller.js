import * as userService from '../services/user.service';
import * as tokenService from '../services/token.service';

export const register = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        const token = await tokenService.getAccessTokens(user);
        res.json({ user, token });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUserWithEmailAndPassword(email, password);
        const token = await tokenService.getAccessTokens(user);
        res.send({ user, token });
    } catch (err) {
        next(err);
    }
};
