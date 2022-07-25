import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { User } from '../model/postgres/index';
import { Interest } from '../model/postgres/Interest.postgres';
import { ApiError } from '../utils/ApiError';

export const createUser = async (userBody) => {
    const {
        email, username, password, interests,
    } = userBody;
    if (!interests?.length) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'At least one interest is required');
    }
    const newUser = await User.create({
        email,
        username,
        password,
    });
    // find interests
    const interestsList = await Interest.findAll({
        where: {
            id: {
                [Op.in]: interests.map((interest) => interest.id),
            },
        },
    });
    // add interests to user
    await newUser.addInterests(interestsList);
    return User.findByPk(newUser.id, {
        include: [
            {
                model: Interest,
                as: 'interests',
            },
        ],
    });
};

export const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect credentials');
    }
    if (!user.active) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'User is not validated');
    }
    if (user?.googleId) {
        return false;
    }
    const isPasswordMatch = await bcryptjs.compare(password, user?.password);
    if (!isPasswordMatch) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect credentials');
    }

    return user;
};
