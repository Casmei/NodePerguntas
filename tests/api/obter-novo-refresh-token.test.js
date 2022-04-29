import request from 'supertest'
import { app } from '../..'
import { nonStringList } from '../../src/utils'
import { createTestUser } from '../config'

const req = request(app)

let user

describe('POST /api/refresh-token', () => {
    beforeAll(async () => (user = await createTestUser()))

    it('Deve retornar um novo accessToken e refreshToken', async () => {
        const r = await req.post('/api/refresh-token').send({ refreshToken: user.refreshToken })

        const { accessToken, refreshToken } = r.body

        expect(r.status).toBe(200)
        expect(accessToken).toBeTruthy()
        expect(refreshToken).toBeTruthy()
    })

    it('Não deve retornar um novo accessToken e refreshToken se o refreshToken não for válido', async () => {
        for (const refreshToken of nonStringList) {
            await req.post('/api/refresh-token').send({ refreshToken }).expect(422)
        }
    })
})
