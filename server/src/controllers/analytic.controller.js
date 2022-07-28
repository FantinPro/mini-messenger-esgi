import mongoose from 'mongoose';
import * as analyticService from '../services/analytic.service';
import { Analytic } from '../model/mongodb/Analytic';

export const addNewSession = async (req, res, next) => {
    try {
        const { userId, config } = req.body;

        const analytic = await Analytic.findOne({ userId });

        if (!analytic) {
            const newAnalytic = await Analytic.create({
                userId,
                sessions: [{ ...config }],
            });

            res.json({ id: newAnalytic.id });
        } else {
            analytic.sessions.push(config);
            await analytic.save();
            res.json({ id: analytic.id });
        }
    } catch (e) {
        next(e);
    }
};

export const updateSession = async (req, res, next) => {
    try {
        const { userId, sessionId, duration } = req.body;

        const analytic = await Analytic.updateOne(
            { userId, 'sessions.sessionId': sessionId },
            { $set: { 'sessions.$.duration': duration } },
        );

        res.json({ id: analytic.id });
    } catch (e) {
        next(e);
    }
};

export const getSessions = async (req, res, next) => {
    try {
        const analytic = await Analytic.find();

        res.json(analytic);
    } catch (e) {
        next(e);
    }
};

export const update = async (req, res, next) => {
    try {
        const { userId, config } = req.body;

        try {
            const newAnalytic = await Analytic.updateOne(
                { userId },
                { $push: { sessions: { ...config } } },
            );

            res.json({ id: newAnalytic.id });
        } catch (e) {
            res.status(404).send();
        }
    } catch (e) {
        next(e);
    }
};

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
