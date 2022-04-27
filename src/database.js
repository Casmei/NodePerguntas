import { PrismaClient } from '@prisma/client'
import { findPath, isArray } from './utils'

const prisma = new PrismaClient()

// Transforma o avatar que é um buffer em base64
prisma.$use(async (params, next) => {
    const r = await next(params)

    if (r) {
        if (isArray(r)) {
            return r.map(item => {
                const path = findPath(item, 'avatar')

                if (path.length) {
                    const avatar = path.reduce((obj, key) => obj[key], item)

                    const a = path.slice(0, -1).reduce((obj, key) => obj[key], item)
                    a['avatar'] = avatar.toString('base64')

                    return a
                }
                return item
            })
        } else {
            const avatarPath = findPath(r, 'avatar')

            if (avatarPath.length) {
                const avatar = avatarPath.reduce((obj, key) => obj[key], r)

                const a = avatarPath.slice(0, -1).reduce((obj, key) => obj[key], r)
                a['avatar'] = avatar.toString('base64')
            }
        }
    }

    return r
})

export { prisma }
