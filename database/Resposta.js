const Sequelize = require('sequelize');
const connection = require('./database');

const Resposta = connection.define('Resposta', {
	corpo: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	perguntaId: {
		type: Sequelize.INTEGER,
		allowNull: false
	} //Toda resposta pertence a uma pergunta
});

Resposta.sync({ force: false });

module.exports = Resposta;
