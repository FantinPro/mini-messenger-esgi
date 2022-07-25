import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from './config';
import * as usersService from '../services/user.service';
import * as tokensService from '../services/token.service';
import { Interest, User } from '../model/postgres/index';

const jwtVerify = async (payload, done) => {
    try {
        const user = await User.findByPk(payload.id, {
            include: [
                {
                    model: Interest,
                    as: 'interests',
                },
            ],
        });
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const googleVerify = async (accessToken, refreshToken, profile, cb) => {
    try {
        const { id, emails } = profile;
        let user = await User.findOne({ where: { googleId: profile.id } });
        if (!user) {
            user = await usersService.createUser({
                googleId: id,
                email: emails[0].value,
            });
            // dont't need to do this but if we want to store display name in the future, we will update it.
            User.update({ googleId: id }, { where: { id: user.id }, returning: true });
        }
        const token = await tokensService.getAccessTokens(user);

        cb(null, { user, token });
    } catch (error) {
        cb(error, false);
    }
};

export const initialize = function (app) {
    // init default passport behavior
    app.use(passport.initialize());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // add jwt strategy
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret,
    };
    passport.use(
        new Strategy(opts, jwtVerify),
    );

    // google strategy
    passport.use(new GoogleStrategy.Strategy({
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl,
    }, googleVerify));
};
