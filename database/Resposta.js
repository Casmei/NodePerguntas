const Sequelize = require('sequelize');
const connection = require('./database');

const Resposta = connection.define('Resposta', {
	corpo: {
		type: Sequelize.TEXT,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'O campo resposta não pode ser vazio!'
			},
			len: {
				args: [ 4, 500 ],
				msg: 'O campo Resposta precisa ter no minímo 4 caracteres'
			}
		}
	},
	perguntaId: {
		type: Sequelize.INTEGER,
		allowNull: false
	} //Toda resposta pertence a uma pergunta
});

Resposta.sync({ force: false });

module.exports = Resposta;
