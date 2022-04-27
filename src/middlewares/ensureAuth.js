import { verifyAccessToken } from '../utils'

export async function ensureAuthenticated(req, res, next) {
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' })
    }

    const [, accessToken] = authorization.split(' ')

    const payload = verifyAccessToken(accessToken)

    if (!payload) return res.status(401).json({ error: 'Invalid token' })

    req.userId = payload.userId

    next()
}
