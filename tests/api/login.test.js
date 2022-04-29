import request from 'supertest'
import { app } from '../..'
import { nonStringList } from '../../src/utils'
import { deleteAllUsers, pngB64 } from '../config'

const req = request(app)

describe('POST /api/login', () => {
    beforeEach(deleteAllUsers)

    it('Deve logar um usuário', async () => {
        await req.post('/api/register').send({ name: 'teste', email: 'foo@bar.com', password: '12345678', avatar: pngB64 })

        const r = await req.post('/api/login').send({ email: 'foo@bar.com', password: '12345678' })

        const { user, accessToken, refreshToken } = r.body

        expect(r.status).toBe(200)
        expect(user).toBeTruthy()
        expect(accessToken).toBeTruthy()
        expect(refreshToken).toBeTruthy()
    })

    it('Não deve logar um usuário com email ou senha incorretos', async () => {
        await req.post('/api/login').send({ email: 'foo@bar.com', password: '12345678' }).expect(401)

        await req.post('/api/register').send({ name: 'teste', email: 'foo@bar.com', password: '12345678', avatar: pngB64 })
        await req.post('/api/login').send({ email: 'foo@bar.com', password: '12345678-10' }).expect(401)

        for (const email of nonStringList) {
            await req.post('/api/login').send({ email, password: '12345678' }).expect(422)
        }

        for (const password of nonStringList) {
            await req.post('/api/login').send({ email: 'foo@bar.com', password }).expect(422)
        }
    })
})
