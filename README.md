<h1 align="center">Code Alms | Perguntas e Respostass
</h1>
<!-- ME CONTRATA! AAAAAAAAAAAA kkkkk -->

Esse projeto foi desenvolvido inicialmente com base no curso [Formação Node.js](https://www.udemy.com/course/formacao-nodejs/) do professor Victor Lima. Ao final do projeto, para melhorar minhas habilidades com a tecnologia, decidi realizar algumas mudanças, seja na interface, estrutura ou lógica da aplicação.
### 🔖 Sobre
O projeto consiste em uma plataforma de perguntas e respostas (até o momento anônimas), em que qualquer usuário que esteja precisando tirar ou esclarecer alguma dúvida pode realizar sua pergunta. As perguntas realizadas são listadas na página inicial da plataforma, o usuário, ao clicar em qualquer pergunta será direcionado a página especifica da pergunta. Essa página conta com a pergunta em especifica a ser respondida, o campo de resposta e, logo em baixo, uma listagem de todas últimas respostas. 

---

<h2 align="center"> 
	🚧  Projeto em desenvolvimento...  🚧
</h2>

### ✅ Próximos recursos

- [x] Deploy da aplicação no Heroku
- [ ] Cadastro/Login de usuário
- [ ] Manter o usuário logado
- [ ] Melhorar o sistema de validação
- [ ] Linkar as perguntas e respostas ao usuário

---

<h1 align="center">Instalação
</h1>

### 🏁 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Mysql](https://www.mysql.com/) e o [Mysql Workbech](https://www.mysql.com/products/workbench/).

### 🎲 Rodando o Back End (servidor)
- Clone este repositório <br>
```git clone <https://github.com/Casmei/Node-Perguntas>```

- Acesse a pasta do projeto no terminal/cmd <br>
```cd Node-Perguntas```

- Instale as dependências <br>```npm install```

- Configure suas váriaveis de ambiente, para que o banco de dados funcione corretamente. Para isso acesse [./env.example](/.env.example) e renomeie o arquivo para ```.env```, após isso, coloque as informações de conexão do banco de dados:
```
DB_HOST= localhost
DB_PORT= a porta (3306 é o padrão do Mysql)
DB_USER= seu usuário (root é o padrão)
DB_PASSWORD= sua senha
DB_NAME= nome do squema
```

- Execute a aplicação <br>
```nodemon index.js```

O servidor inciará na porta:8080 - acesse <http://localhost:8080>

### ⚒️ Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Sequelize](https://www.typescriptlang.org/)
- [Ejs](https://ejs.co/)

---

<h2 align="center">Colaboradores
</h2>

<table>
  <tr>
    <td align="center"><a href="https://github.com/bitpickle"><img src="https://avatars.githubusercontent.com/u/52581118" width="100px;" alt=""/><br /><sub><b>Péricles Pires</b></sub></td>
    <td align="center"><a href="https://github.com/ArthurRAmaral"><img src="https://avatars.githubusercontent.com/u/48517851" width="100px;"  alt=""/><br /><sub><b>Arthur Rocha</b></sub></a><br /></td>
    
  </tr>
 </table>

---



Feito com ❤️ e ☕ por Tiago de Castro 👋🏽 [Entre em contato!](https://www.linkedin.com/in/tiago-de-castro-lima-3814911b9/) <br>
Este projeto esta sobe a licença [MIT](./LICENSE).



