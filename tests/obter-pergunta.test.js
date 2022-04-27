import request from 'supertest'
import { app } from '..'
import { createTestPergunta, createTestUser } from './config'

const req = request(app)

let user
let pergunta

describe('GET /api/pergunta/:id', () => {
    beforeAll(async () => {
        user = await createTestUser()
        pergunta = await createTestPergunta(user)
    })

    it('Deve retornar uma pergunta', async () => {
        await req
            .get(`/api/pergunta/${pergunta.id}`)
            .set('Authorization', `Bearer ${user.accessToken}`)
            .expect(200)
            .expect(res => {
                const { pergunta } = res.body

                expect(pergunta.titulo).toEqual('teste')
                expect(pergunta.descricao).toEqual('descrição de teste')
                expect(pergunta.userId).toEqual(pergunta.userId)
            })
    })

    it('Não deve retornar uma pergunta se o usuário não tiver autenticado', async () => {
        await req.get('/api/pergunta/1').expect(401)
    })

    it('Não deve retornar uma pergunta se o id não existir', async () => {
        await req.get('/api/pergunta/100').set('Authorization', `Bearer ${user.accessToken}`).expect(404)
    })
})
