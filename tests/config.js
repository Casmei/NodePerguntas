import { prisma } from '../src/database'
import request from 'supertest'
import { app } from '../'
import { readFileSync } from 'fs'

const pngB64 = Buffer.from(readFileSync('tests/images/png.png')).toString('base64')
const jpgB64 = Buffer.from(readFileSync('tests/images/jpg.jpg')).toString('base64')
const jpegB64 = Buffer.from(readFileSync('tests/images/jpeg.jpeg')).toString('base64')
const webpB64 = Buffer.from(readFileSync('tests/images/webp.webp')).toString('base64')
const gifB64 = Buffer.from(readFileSync('tests/images/gif.gif')).toString('base64')

async function deleteAllUsers() {
    await prisma.users.deleteMany()
}

async function deleteAllPerguntas() {
    await prisma.perguntas.deleteMany()
}

async function deleteAllRespostas() {
    await prisma.respostas.deleteMany()
}

async function getAllUsers() {
    return await prisma.users.findMany()
}

async function createTestUser() {
    return (
        await request(app)
            .post('/api/register')
            .send({ name: 'teste', email: 'foo@bar.com', password: '12345678', avatar: pngB64 })
    ).body
}

async function createTestPergunta(user) {
    return (
        await request(app)
            .post('/api/pergunta')
            .send({ titulo: 'teste', descricao: 'descrição de teste' })
            .set({ Authorization: `Bearer ${user.accessToken}` })
    ).body.pergunta
}

export {
    deleteAllUsers,
    deleteAllPerguntas,
    deleteAllRespostas,
    getAllUsers,
    createTestUser,
    createTestPergunta,
    pngB64,
    jpgB64,
    jpegB64,
    webpB64,
    gifB64,
}
