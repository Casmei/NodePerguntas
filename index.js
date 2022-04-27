const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta.js');
const Resposta = require('./database/Resposta.js');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv/config');
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
//Configuração da validação
app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// =-=-=-=-=-=-=-=-=-=-= Rotas =-=-=-=-=-=-=-=-=-=-=
// =========== Principal ===========
app.get('/', (req, res) => {
	//Pego todas as perguntas do Bd
	Pergunta.findAll({
		raw: true,
		//Ordenando o id em ordem decrescente
		order: [ [ 'id', 'DESC' ] ]
		//Caso dê certo, faça isso:
	}).then((perguntas) => {
		res.render('index', {
			perguntas: perguntas,
			contador: 0
		});
	});
});

// =========== Realizar pergunta ===========
app.get('/perguntar', (req, res) => {
	let erros = req.flash('erros')[0];
	res.render('perguntar', { erros: erros, contador: 0 });
});
// =========== Salvar pegunta ===========
app.post('/salvarpergunta', (req, res) => {
	//Primeiro recebo os dados do form
	let titulo = req.body.titulo;
	let descricao = req.body.descricao;
	//Salvo os dados no Banco de dados INSERT
	Pergunta.create({
		titulo: titulo,
		descricao: descricao
	})
		.then(() => {
			res.redirect('/');
		})
		.catch(({ errors }) => {
			req.flash('erros', { erros: errors.map(({ message }) => message) });
			res.redirect('perguntar');
		});
});
// =========== Excluir pegunta ===========
app.post('/excluir', (req, res) => {
	console.log('Página encontrada');
	//Pego o id da pergunta que quero apagar
	let id = req.body.id;
	let sucesso = 'Pergunta apagada com sucesso!';
	console.log(id);
	//Verifico o ID
	if (id != undefined) {
		if (!isNaN(id)) {
			Pergunta.destroy({
				where: {
					id: id
				}
			}).then(() => {
				res.redirect('/');
			});
		} else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
});

// =========== Visualizar pergunta ===========
app.get('/pergunta/:id', (req, res) => {
	let id = req.params.id;
	Pergunta.findOne({
		where: { id: id }
	}).then((pergunta) => {
		if (pergunta != undefined) {
			//pegar todas as respostas referentes a minha pergunta
			Resposta.findAll({
				where: { perguntaId: pergunta.id }
			}).then((respostas) => {
				//Variavel de erro caso exista
				let erros = req.flash('erros')[0];
				//Achou a pergunta
				res.render('pergunta', {
					pergunta: pergunta,
					respostas: respostas,
					erros: erros,
					contador: 0
				});
			});
		} else {
			//Não achou a pergunta
			res.render('naoencontrada');
		}
	});
});
// =========== Responder pergunta ===========

app.post('/responder', (req, res) => {
	let corpo = req.body.corpo;
	let perguntaId = req.body.pergunta;

	Resposta.create({
		corpo: corpo,
		perguntaId: perguntaId
	})
		.catch(({ errors }) => {
			req.flash('erros', { erros: errors.map(({ message }) => message) });
		})
		.finally(() => {
			res.redirect('/pergunta/' + perguntaId.trim());
		});
});

// =========== Editar pergunta ===========
app.get('/edit/:id', (req, res) => {
	let id = req.params.id;

	if (isNaN(id)) {
		res.redirect('/');
	}

	Pergunta.findByPk(id)
		.then((pergunta) => {
			if (pergunta != undefined) {
				res.render('edit', { pergunta: pergunta });
			} else {
				res.redirect('/');
			}
		})
		.catch((erro) => {
			res.redirect('/');
		});
});

app.post('/salvaratualizacao', (req, res) => {
	let id = req.body.id;
	let titulo = req.body.titulo;
	let descricao = req.body.descricao;

	Pergunta.update(
		{ titulo: titulo, descricao: descricao },
		{
			where: {
				id: id
			}
		}
	).then(() => {
		res.redirect('/');
	});
});

app.listen(process.env.PORT || 8080, () => {
	console.log('🚀 Sevidor rodando! - http://localhost:8080/');
});
