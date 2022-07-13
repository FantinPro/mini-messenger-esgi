import { Interest } from '../src/model/postgres/Interest.postgres';

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
// create many interests
const fixtures = async function () {
    await Interest.destroy({
        where: {},
        force: true,
    });
    return Interest.bulkCreate(programmingLanguages);
};

fixtures().then(() => {
    console.log('fixtures created');
}).catch((err) => {
    console.log(err);
}).finally(() => {
    process.exit(0);
});
