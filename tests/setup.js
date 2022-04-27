import { deleteAllPerguntas, deleteAllRespostas, deleteAllUsers } from './config'

afterAll(async () => {
    await deleteAllUsers()
    await deleteAllPerguntas()
    await deleteAllRespostas()
})
