const Sequelize = require('sequelize');
require('dotenv/config');

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql',
	port: process.env.DB_PORT
});

//mysql://ba76cdff226706:7b430b5d@us-cdbr-east-05.cleardb.net/heroku_ee9ea716189ae45?reconnect=true

module.exports = connection;
