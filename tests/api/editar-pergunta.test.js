import request from 'supertest'
import { app } from '../..'
import { nonStringList } from '../../src/utils'
import { createTestUser, deleteAllPerguntas, createTestPergunta } from '../config'

const req = request(app)

let user

describe('PUT /api/pergunta/:id', () => {
    beforeAll(async () => (user = await createTestUser()))
    beforeEach(deleteAllPerguntas)

    it('Deve atualizar uma pergunta', async () => {
        const pergunta = await createTestPergunta(user)

        await req
            .put(`/api/pergunta/${pergunta.id}`)
            .send({
                titulo: 'Titulo atualizado',
                descricao: 'Descrição atualizada',
            })
            .set('Authorization', `Bearer ${user.accessToken}`)
            .expect(200)
            .expect(res => {
                const { titulo, descricao } = res.body.pergunta

                expect(titulo).toBe('Titulo atualizado')
                expect(descricao).toBe('Descrição atualizada')
            })
    })

    it('Não deve atualizar uma pergunta se o usuário não tiver autenticado', async () => {
        const pergunta = await createTestPergunta(user)

        await req
            .put(`/api/pergunta/${pergunta.id}`)
            .send({
                titulo: 'Titulo atualizado',
                descricao: 'Descrição atualizada',
            })
            .expect(401)
    })

    it('Não deve atualizar uma pergunta com titulo ou descrição inválidos', async () => {
        const pergunta = await createTestPergunta(user)

        for (const titulo of nonStringList) {
            await req
                .put(`/api/pergunta/${pergunta.id}`)
                .send({
                    titulo,
                    descricao: 'Descrição atualizada',
                })
                .set('Authorization', `Bearer ${user.accessToken}`)
                .expect(422)
        }

        for (const descricao of nonStringList) {
            await req
                .put(`/api/pergunta/${pergunta.id}`)
                .send({
                    titulo: 'Titulo atualizado',
                    descricao,
                })
                .set('Authorization', `Bearer ${user.accessToken}`)
                .expect(422)
        }
    })

    it('Não deve atualizar uma pergunta se o id não existir', async () => {
        await req
            .put('/api/pergunta/1')
            .send({
                titulo: 'Titulo atualizado',
                descricao: 'Descrição atualizada',
            })
            .set('Authorization', `Bearer ${user.accessToken}`)
            .expect(404)
    })
})
