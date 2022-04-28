const Sequelize = require('sequelize');
const connection = require('../database/database');

const Pergunta = connection.define('Pergunta', {
	titulo: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'O campo Título não pode ser vazio!'
			},
			len: {
				args: [ 4, 100 ],
				msg: 'O campo Título precisa ter no minímo 4 caracteres'
			}
		}
	},
	descricao: {
		type: Sequelize.TEXT,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'O campo Descrição não pode ser vazio!'
			}
		}
	}
});

Pergunta.sync({ force: false }).then(() => {});

module.exports = Pergunta;
