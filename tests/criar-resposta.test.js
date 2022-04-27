import request from 'supertest'
import { app } from '..'
import { nonStringList } from '../src/utils'
import { createTestPergunta, createTestUser } from './config'

const req = request(app)

let pergunta
let user

describe('POST /api/resposta', () => {
    beforeAll(async () => (pergunta = await createTestPergunta((user = await createTestUser()))))

    it('Deve criar uma resposta', async () => {
        await req
            .post('/api/resposta')
            .send({
                resposta: 'teste',
                perguntaId: pergunta.id,
            })
            .set({ Authorization: `Bearer ${user.accessToken}` })
            .expect(res => {
                const { resposta } = res.body

                expect(resposta.resposta).toEqual('teste')
                expect(resposta.perguntaId).toEqual(pergunta.id)
                expect(resposta.userId).toEqual(pergunta.userId)
            })
            .expect(201)
    })

    it('Não deve criar uma resposta com um perguntaId ou resposta inválidos', async () => {
        for (const perguntaId of nonStringList) {
            await req
                .post('/api/resposta')
                .send({
                    resposta: 'teste',
                    perguntaId,
                })
                .set({ Authorization: `Bearer ${user.accessToken}` })
                .expect(422)
        }

        for (const resposta of nonStringList) {
            await req
                .post('/api/resposta')
                .send({
                    resposta,
                    perguntaId: pergunta.id,
                })
                .set({ Authorization: `Bearer ${user.accessToken}` })
                .expect(422)
        }
    })

    it('Não deve criar uma resposta sem estar autenticado', async () => {
        await req
            .post('/api/resposta')
            .send({
                resposta: 'teste',
                perguntaId: pergunta.id,
            })
            .expect(401)
    })
})
