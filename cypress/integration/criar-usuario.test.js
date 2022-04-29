/// <reference types="cypress" />

describe('Criar usuário', () => {
    beforeEach(() => {
        cy.request('DELETE', 'http://localhost:3000/api/delete-all-users')
        cy.visit('http://localhost:3000/register')
    })

    it('Deve criar um usuário', () => {
        cy.intercept('POST', 'http://localhost:3000/api/register').as('register-user')
        cy.get('.avatar > label').selectFile('tests/images/png.png')
        cy.get('.name-input').type('asadasdadasdas')
        cy.get('.email-input').type('foo@bar.com')
        cy.get('.password-input').type('12345678')

        cy.get('.btn').click()
        cy.wait('@register-user').its('response.statusCode').should('eq', 201)
    })

    it('Não deve criar um novo usuário com um nome ou email já existente', () => {
        cy.intercept('POST', 'http://localhost:3000/api/register').as('register-user')

        cy.get('.avatar > label').selectFile('tests/images/png.png')
        cy.get('.name-input').type('asadasdadasdas')
        cy.get('.email-input').type('foo@bar.com')
        cy.get('.password-input').type('12345678')

        cy.get('.btn').click()
        cy.wait('@register-user').its('response.statusCode').should('eq', 201)

        cy.visit('http://localhost:3000/register')

        cy.get('.avatar > label').selectFile('tests/images/png.png')
        cy.get('.name-input').type('asadasdadasdas')
        cy.get('.email-input').type('foo@bar.com')
        cy.get('.password-input').type('12345678')

        cy.get('.btn').click()
        cy.wait('@register-user').its('response.statusCode').should('eq', 409)
    })
})
