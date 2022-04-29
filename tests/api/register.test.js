import request from 'supertest'
import { app } from '../..'
import { nonStringList } from '../../src/utils'
import { deleteAllUsers, gifB64, jpegB64, jpgB64, pngB64, webpB64 } from '../config'

const req = request(app)

describe('POST /api/register', () => {
    beforeEach(deleteAllUsers)

    it('Deve criar um novo usuário e obter o accessToken e refreshToken', async () => {
        await req
            .post('/api/register')
            .send({ name: 'teste', email: 'foo@bar.com', password: '12345678', avatar: pngB64 })
            .expect(r => {
                const { user, accessToken, refreshToken } = r.body

                expect(r.status).toBe(201)
                expect(user.name).toBe('teste')
                expect(accessToken).toBeTruthy()
                expect(refreshToken).toBeTruthy()
            })
            .expect(201)
    })

    it('Não deve criar um novo usuário com um nome ou email já existente', async () => {
        await req
            .post('/api/register')
            .send({ name: 'teste', email: 'foo@bar.com', password: '12345678', avatar: pngB64 })
            .expect(201)
        await req
            .post('/api/register')
            .send({ name: 'teste', email: 'foo2@bar.com', password: '12345678', avatar: pngB64 })
            .expect(409)

        await deleteAllUsers()

        await req
            .post('/api/register')
            .send({ name: 'teste', email: 'foo@bar.com', password: '12345678', avatar: pngB64 })
            .expect(201)
        await req
            .post('/api/register')
            .send({ name: 'teste 2', email: 'foo@bar.com', password: '12345678', avatar: pngB64 })
            .expect(409)
    })

    it('Não deve criar um novo usuário com um nome, email ou senha inválidos', async () => {
        for (const email of [...nonStringList, 'foo', 'foo@bar', 'foo@bar.']) {
            await req
                .post('/api/register')
                .send({ name: 'teste', email, password: '12345678', avatar: pngB64 })
                .expect(422)
        }

        for (const name of [...nonStringList, 'aa']) {
            await req
                .post('/api/register')
                .send({ name, email: 'foo@bar.com', password: '12345678', avatar: pngB64 })
                .expect(422)
        }

        for (const password of [...nonStringList, '1234567']) {
            await req
                .post('/api/register')
                .send({ name: 'teste', email: 'foo@bar.com', password, avatar: pngB64 })
                .expect(422)
        }
    })

    it('Não deve criar um novo usuário sem avatar', async () => {
        await req
            .post('/api/register')
            .send({ name: 'teste', email: 'foo@bar.com', password: '12345678' })
            .expect(422)
    })

    it('Deve aceitar todos os tipos de imagens válidos para o avatar', async () => {
        for (const [i, avatar] of [pngB64, jpgB64, jpegB64, webpB64, gifB64].entries()) {
            await req
                .post('/api/register')
                .send({ name: `teste-${i}`, email: `foo-${i}@bar.com`, password: '12345678', avatar })
                .expect(201)
        }
    })
})
