import request from 'supertest'
import { app } from '..'
import { createTestUser } from './config'

const req = request(app)

let user

describe('GET /api/all-perguntas', () => {
    beforeAll(async () => {
        user = await createTestUser()

        for (let i = 0; i < 10; i++) {
            await req
                .post('/api/pergunta')
                .send({ titulo: `teste${i}`, descricao: 'Descrição de teste' })
                .set('Authorization', `Bearer ${user.accessToken}`)
                .expect(201)
        }
    })

    it('Deve retornar todas as perguntas', async () => {
        await req
            .get('/api/all-perguntas')
            .set('Authorization', `Bearer ${user.accessToken}`)
            .expect(200)
            .expect(res => expect(res.body.perguntas.length).toBe(10))
    })

    it('Não deve retornar todas as perguntas se o usuário não tiver autenticado', async () => {
        await req.get('/api/all-perguntas').expect(401)
    })
})
