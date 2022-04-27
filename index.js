import express, { urlencoded, json } from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import flash from 'connect-flash'
import router from './src/routes'
import 'dotenv/config'

export const app = express()

// =========== Ejs Config ===========
// Dizendo para o express que o ejs é a view engine
app.set('view engine', 'ejs')
app.use(express.static('src/public'))

app.set('views', 'src/views')

//  =========== BodyParser Config ===========
// Permitir que a pessoa envie os dados e traduza em uma
// Estrutura Js
app.use(urlencoded({ extended: true }))
// Permite que leia dados de formulário via json
// Aceita json maiores que 10mb, ele fica grande quando recebe um b64 de um gif
app.use(json({ limit: '10mb' }))

// Configuração da validação
app.use(cookieParser('secret'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())

app.use(router)

if (process.env.NODE_ENV === 'production') {
    app.listen(3000)
}

export const viteNodeApp = app
