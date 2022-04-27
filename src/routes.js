import axios from 'axios'
import { Router } from 'express'
import { apiRouter } from './api'
import { prisma } from './database'

const router = Router()
router.use(apiRouter)

// =========== Tela de Registro ===========
router.get('/register', (req, res) => {
    res.render('register')
})

// =========== Tela de Login ===========
router.get('/login', (req, res) => {
    res.render('login', { errors: [], contador: 0 })
})


// =========== Principal ===========
router.get('/', async (req, res) => {
    res.render('index', { perguntas: [], contador: 0 })
})





// =========== Realizar pergunta ===========
router.get('/perguntar', (req, res) => {
    let errors = req.flash('errors')[0]
    res.render('perguntar', { errors, contador: 0 })
})

// =========== Recebimento da pegunta ===========
router.post('/salvarpergunta', async (req, res) => {
    const errors = []
    const { titulo, descricao } = req.body

    if (!titulo) {
        errors.push('Título é obrigatório')
    }
    if (!descricao) {
        errors.push('Descrição é obrigatório')
    }

    if (errors.length > 0) {
        req.flash('errors', errors)
        res.redirect('/perguntar')
    } else {
        // TODO: Salvar pergunta no banco de dados
    }

    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
    })
        .then(() => {
            res.redirect('/')
        })
        .catch(({ errors }) => {
            req.flash('errors', { errors: errors.map(({ message }) => message) })
            res.redirect('perguntar')
        })

    // .then(() => {
    // 	//Caso ocorra com sucesso eu redireciono o usuário
    // 	res.redirect('/');
    // })
    // .catch(({ errors }) => {
    // 	const renderErrorMessages = { errors: errors.map(({ message }) => message) };
    // 	res.render('perguntar', renderErrorMessages);
    // });
})

// =========== Visualizar pergunta ===========
router.get('/pergunta/:id', (req, res) => {
    let id = req.params.id
    Pergunta.findOne({
        where: { id: id },
    }).then(pergunta => {
        if (pergunta != undefined) {
            //pegar todas as respostas referentes a minha pergunta
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
            }).then(respostas => {
                //Variavel de erro caso exista
                let errors = req.flash('errors')[0]
                //Achou a pergunta
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas,
                    errors: errors,
                    contador: 0,
                })
            })
        } else {
            //Não achou a pergunta
            res.render('naoencontrada')
        }
    })
})
// =========== Responder pergunta ===========

router.post('/responder', (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId,
    })
        .catch(({ errors }) => {
            req.flash('errors', { errors: errors.map(({ message }) => message) })
        })
        .finally(() => {
            res.redirect('/pergunta/' + perguntaId.trim())
        })
})

export default router
