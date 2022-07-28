import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/api/v1/interests`;

export const interestService = {
    getAllInterests
};

function getAllInterests() {
    return httpMethodsWrapper.get(`${baseUrl}`);
}
