import request from 'supertest'
import { app } from '..'
import { createTestPergunta, createTestUser, deleteAllPerguntas } from './config'

const req = request(app)

let user

describe('DELETE /api/pergunta/:id', () => {
    beforeAll(async () => (user = await createTestUser()))
    beforeEach(deleteAllPerguntas)

    it('Deve deletar uma pergunta', async () => {
        const pergunta = await createTestPergunta(user)
        await req
            .delete(`/api/pergunta/${pergunta.id}`)
            .set('Authorization', `Bearer ${user.accessToken}`)
            .expect(204)
    })

    it('Não deve deletar uma pergunta se o usuário não tiver autenticado', async () => {
        const pergunta = await createTestPergunta(user)
        await req.delete(`/api/pergunta/${pergunta.id}`).expect(401)
    })

    it('Não deve deletar uma pergunta se a pergunta não existir', async () => {
        await req.delete('/api/pergunta/123').set('Authorization', `Bearer ${user.accessToken}`).expect(404)
    })
})
