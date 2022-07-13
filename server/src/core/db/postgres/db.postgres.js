import Sequelize from 'sequelize';

const connection = new Sequelize(process.env.POSTGRES_DATABASE_URL, {
    newUrlParser: true,
});

connection.authenticate().then(() => {
    console.log('Postgres (with sequelize) default connection open.');
}).catch((err) => {
    console.error(`Unable to connect to the database >> ${process.env.POSTGRES_DATABASE_URL}:`, err);
});

export { connection };
