import { Router } from 'express'
import { generateAccessToken, generateRefreshToken, isGif, isImage, isString } from './utils'
import { prisma } from './database'
import { nanoid } from 'nanoid'
import { ensureAuthenticated } from './middlewares/ensureAuth'
import { verifyRefreshToken } from './utils'
import sharp from 'sharp'

export const apiRouter = Router()

// ? accessToken
// ? https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/

// ? refreshToken
// ? https://www.bezkoder.com/jwt-refresh-token-node-js/

// Criar usuário
apiRouter.post('/api/register', async (req, res) => {
    const { name, email, password, avatar } = req.body

    if (name === undefined) return res.status(422).json({ error: 'name is required' })
    if (email === undefined) return res.status(422).json({ error: 'email is required' })
    if (password === undefined) return res.status(422).json({ error: 'password is required' })
    if (avatar === undefined) return res.status(422).json({ error: 'avatar is required' })

    if (!isString(name)) return res.status(422).json({ error: 'name must be a string' })
    if (!isString(email)) return res.status(422).json({ error: 'email must be a string' })
    if (!isString(password)) return res.status(422).json({ error: 'password must be a string' })
    if (!isString(avatar)) return res.status(422).json({ error: 'avatar must be a string' })

    // https://stackoverflow.com/a/32686261/14243840
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(422).json({ error: 'email is invalid' })
    if (password.length < 8) return res.status(422).json({ error: 'password must be at least 6 characters' })
    if (name.length < 3) return res.status(422).json({ error: 'name must be at least 3 characters' })

    const avatarBuffer = Buffer.from(avatar, 'base64')
    const avatarIsGif = isGif(avatarBuffer)

    if (!(isImage(avatarBuffer) || avatarIsGif)) {
        return res.status(422).json({ error: 'avatar must be a .png, .jpeg, .jpg, .webp or .gif' })
    }

    const imageBuffer = await sharp(avatarBuffer, { animated: avatarIsGif })
        .resize(200, 200)
        // https://stackoverflow.com/a/66843579/14243840
        .webp({ nearLossless: true, quality: 50 })
        .toBuffer()

    const nameExists = await prisma.users.findFirst({ where: { name } })
    if (nameExists) return res.status(409).json({ error: 'name already exists' })

    const emailExists = await prisma.users.findFirst({ where: { email } })
    if (emailExists) return res.status(409).json({ error: 'email already exists' })

    const user = await prisma.users.create({
        data: {
            id: nanoid(),
            name,
            email,
            password,
            avatar: imageBuffer,
        },
    })

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.status(201).json({ user, accessToken, refreshToken })
})

// Logar o usuário
apiRouter.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    if (email === undefined) return res.status(422).json({ error: 'email is required' })
    if (password === undefined) return res.status(422).json({ error: 'password is required' })

    if (!isString(email)) return res.status(422).json({ error: 'email must be a string' })
    if (!isString(password)) return res.status(422).json({ error: 'password must be a string' })

    const user = await prisma.users.findFirst({ where: { email, password } })

    if (!user) return res.status(401).json({ error: 'email or password is invalid' })

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.status(200).json({ user, accessToken, refreshToken })
})

//
apiRouter.post('/api/refresh-token', async (req, res) => {
    const { refreshToken } = req.body
    if (refreshToken === undefined) return res.status(422).json({ error: 'refreshToken is required' })
    if (!isString(refreshToken)) return res.status(422).json({ error: 'refreshToken must be a string' })

    const payload = verifyRefreshToken(refreshToken)
    if (!payload) return res.status(401).json({ error: 'refreshToken is invalid' })

    const user = await prisma.users.findFirst({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ error: 'invalid refreshToken' })

    const newAccessToken = generateAccessToken(user.id)
    const newRefreshToken = generateRefreshToken(user.id)

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
})

// Criar pergunta
apiRouter.post('/api/pergunta', ensureAuthenticated, async (req, res) => {
    const { titulo, descricao } = req.body

    if (titulo === undefined) return res.status(422).json({ error: 'titulo is required' })
    if (descricao === undefined) return res.status(422).json({ error: 'descricao is required' })

    if (!isString(titulo)) return res.status(422).json({ error: 'titulo must be a string' })
    if (!isString(descricao)) return res.status(422).json({ error: 'descricao must be a string' })

    if (titulo.length < 4) return res.status(422).json({ error: 'titulo must be at least 4 characters' })
    if (descricao.length < 10)
        return res.status(422).json({ error: 'descricao must be at least 10 characters' })

    const pergunta = await prisma.perguntas.create({
        data: {
            id: nanoid(),
            titulo,
            descricao,
            user: { connect: { id: req.userId } },
        },
    })

    res.status(201).json({ pergunta })
})

apiRouter.post('/api/resposta', ensureAuthenticated, async (req, res) => {
    const { resposta, perguntaId } = req.body

    if (resposta === undefined) return res.status(422).json({ error: 'resposta is required' })
    if (perguntaId === undefined) return res.status(422).json({ error: 'perguntaId is required' })

    if (!isString(resposta)) return res.status(422).json({ error: 'resposta must be a string' })
    if (!isString(perguntaId)) return res.status(422).json({ error: 'perguntaId must be a string' })

    if (resposta.length < 1) return res.status(422).json({ error: 'resposta cannot be empty' })

    const existsPergunta = await prisma.perguntas.findFirst({ where: { id: perguntaId } })
    if (!existsPergunta) return res.status(401).json({ error: 'perguntaId is invalid' })

    const createdResposta = await prisma.respostas.create({
        data: {
            id: nanoid(),
            resposta,
            pergunta: { connect: { id: perguntaId } },
            user: { connect: { id: req.userId } },
        },
    })

    res.status(201).json({ resposta: createdResposta })
})

apiRouter.get('/api/all-perguntas', ensureAuthenticated, async (req, res) => {
    const perguntas = await prisma.perguntas.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, respostas: true },
    })

    res.status(200).json({ perguntas })
})

apiRouter.get('/api/pergunta/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params

    if (id === undefined) return res.status(422).json({ error: 'id is required' })

    const pergunta = await prisma.perguntas.findFirst({ where: { id }, include: { respostas: true } })
    if (!pergunta) return res.status(404).json({ error: 'pergunta not found' })

    res.status(200).json({ pergunta })
})

apiRouter.delete('/api/pergunta/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params

    if (id === undefined) return res.status(422).json({ error: 'id is required' })

    const pergunta = await prisma.perguntas.findFirst({ where: { id } })
    if (!pergunta) return res.status(404).json({ error: 'pergunta not found' })

    await prisma.perguntas.delete({ where: { id } })

    res.status(204).json()
})

apiRouter.put('/api/pergunta/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params
    const { titulo, descricao } = req.body

    if (titulo === undefined) return res.status(422).json({ error: 'titulo is required' })
    if (descricao === undefined) return res.status(422).json({ error: 'descricao is required' })

    if (!isString(titulo)) return res.status(422).json({ error: 'titulo must be a string' })
    if (!isString(descricao)) return res.status(422).json({ error: 'descricao must be a string' })

    if (titulo.length < 4) return res.status(422).json({ error: 'titulo must be at least 4 characters' })
    if (descricao.length < 10)
        return res.status(422).json({ error: 'descricao must be at least 10 characters' })

    const pergunta = await prisma.perguntas.findFirst({ where: { id } })
    if (!pergunta) return res.status(404).json({ error: 'pergunta not found' })

    const updatedPergunta = await prisma.perguntas.update({
        where: { id },
        data: { titulo, descricao },
    })

    res.status(200).json({ pergunta: updatedPergunta })
})
