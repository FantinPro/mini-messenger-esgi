/* eslint-disable import/first */
import * as justNeedToImportOtherwiseSequelizeDontRecognizeModelsAndRelations from '../src/model/postgres/index';

import { Interest } from '../src/model/postgres/Interest.postgres';
import { roles } from '../src/utils/Helpers';
import { User } from '../src/model/postgres/User.postgres';

const programmingLanguages = [
    {
        title: 'C',
    },
    {
        title: 'C++',
    },
    {
        title: 'C#',
    },
    {
        title: 'Java',
    },
    {
        title: 'JavaScript',
    },
    {
        title: 'Python',
    },
    {
        title: 'Ruby',
    },
    {
        title: 'PHP',
    },
    {
        title: 'Swift',
    },
    {
        title: 'Go',
    },
    {
        title: 'TypeScript',
    },
];

const adminUser = {
    email: 'admin@admin.com',
    username: 'Admin le boss',
    password: 'admin123',
    active: true,
    role: roles.ROLE_ADMIN,
};
// create many interests
const fixtures = async function () {
    const [first, second] = await Interest.bulkCreate(programmingLanguages);

    const user = await User.create(adminUser);

    await user.addInterest([first, second]);
};

fixtures().then(() => {
    console.log('fixtures created');
}).catch((err) => {
    console.log(err);
}).finally(() => {
    process.exit(0);
});
