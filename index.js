const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta.js');
const Resposta = require('./database/Resposta.js');
// =========== DataBase Config ===========
connection
	.authenticate()
	.then(() => {
		console.log('Conexão feita com o banco de dados!');
	})
	.catch((msgErro) => {
		console.log(msgErro);
	});
// =========== Ejs Config ===========
//Dizendo para o express que o ejs é a view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// =========== BodyParser Config ===========
//Permitir que a pessoa envie os dados e traduza em uma
//Estrutura Js
app.use(bodyParser.urlencoded({ extended: false }));
//Permite que leia dados de formulário via json
app.use(bodyParser.json());

// =-=-=-=-=-=-=-=-=-=-= Rotas =-=-=-=-=-=-=-=-=-=-=
// =========== Principal ===========
app.get('/', (req, res) => {
	Pergunta.findAll({
		raw: true,
		order: [
			[ 'id', 'DESC' ] //Ordenando o id em ordem decrescente
		]
	}).then((perguntas) => {
		res.render('index', {
			perguntas: perguntas
		});
	});
});
// =========== Realizar pergunta ===========
app.get('/perguntar', (req, res) => {
	res.render('perguntar');
});
// =========== Recebimento da pegunta ===========
app.post('/salvarpergunta', (req, res) => {
	//Primeiro recebo os dados do form
	let titulo = req.body.titulo;
	let descricao = req.body.descricao;
	//Salvo os dados no Banco de dados INSERT
	Pergunta.create({
		titulo: titulo,
		descricao: descricao
	}).then(() => {
		//Caso ocorra com sucesso eu redireciono o usuário
		res.redirect('/');
	});
});
// =========== Visualizar pergunta ===========
app.get('/pergunta/:id', (req, res) => {
	let id = req.params.id;
	Pergunta.findOne({
		where: { id: id }
	}).then((pergunta) => {
		if (pergunta != undefined) {
			//Achou a pergunta
			res.render('pergunta', {
				pergunta: pergunta
			});
		} else {
			//Não achou a pergunta
			res.render('naoencontrada');
		}
	});
});

app.listen(8080, () => {
	console.log('🚀 Sevidor rodando! - http://localhost:8080/');
});
