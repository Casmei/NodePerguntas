import request from 'supertest'
import { app } from '..'
import { nonStringList } from '../src/utils'
import { createTestUser } from './config'

const req = request(app)

let user

describe('POST /api/pergunta', () => {
    beforeAll(async () => user = await createTestUser())

    it('Deve criar uma nova pergunta', async () => {
        await req.post('/api/pergunta').send({ titulo: 'teste', descricao: 'Descrição de teste' }).set('Authorization', `Bearer ${user.accessToken}`).expect(201)
    })

    it('Não deve criar uma pergunta se o usuário não tiver autenticado', async () => {
        await req.post('/api/pergunta').send({ titulo: 'teste', descricao: 'Descrição de teste' }).expect(401)
    })

    it('Não deve criar uma pergunta com título ou descrição inválidos', async () => {
        for (const titulo of [...nonStringList, '123']) {
            await req.post('/api/pergunta').send({ titulo, descricao: 'Descrição de teste' }).set('Authorization', `Bearer ${user.accessToken}`).expect(422)
        }

        for (const descricao of [...nonStringList, '123456789']) {
            await req.post('/api/pergunta').send({ titulo: 'teste', descricao }).set('Authorization', `Bearer ${user.accessToken}`).expect(422)
        }
    })
})