<p align="center">
  <a href="https://fastify.dev/" target="blank"><img src="https://media.licdn.com/dms/image/v2/D5612AQEUFADeYMSkBg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1689705931627?e=1735776000&v=beta&t=y2cJsJ-8EOmUhtHvQSOAJ685A7le0DJLKXvmUVBfbZk" width="400" alt="Nestjs Logo" /></a>
</p>

<h1 align="center"> Shortlink Service </h1>

## Description
* Aplicação para encurtar link 

## Features
* Implementar uma arquitetura de microsserviços: Separar o sistema em serviços independentes permite escalar componentes específicos conforme a necessidade, além de facilitar a manutenção e o desenvolvimento de novas funcionalidades sem afetar o sistema como um todo.

* Adotar uma camada de cache distribuído: Utilizar um cache distribuído para armazenar dados de acesso frequente, como links encurtados mais acessados, alivia a carga no banco de dados e melhora o tempo de resposta para os usuários.

* Incorporar filas para processamento assíncrono de cliques: Usar filas de mensagens para contabilizar cliques de forma assíncrona permite lidar com um volume alto de acessos sem impactar a performance do sistema principal, aumentando a capacidade de processamento.



## Pré-requisitos
* Este projeto é uma aplicação que utiliza [Docker], [Node.js], [Turbo] e [Prisma] para gerenciar banco de dados. Abaixo estão os passos para rodar a aplicação localmente.

- **Docker**: Para rodar a aplicação em containers.
- **Node.js**: Certifique-se de ter a versão recomendada instalada. Recomendamos usar o [Node 18+].
- **Nota**: O [Turbo] está incluído como dependência de desenvolvimento. Não é necessário instalar o Turbo globalmente.

## Node Version
* '>=v18 <=v22'

## Config (.env)
Para configurar o ambiente do projeto:

1. **Renomeie o arquivo `.example.env` para `.env` em cada dominio 'em /apps shortlink e user'**.
   
## Docker
```bash
# Start the application using Docker:
$ docker compose up -d
```

## Dependecy Installation
```bash
# Install project dependencies:
$ npm install
```

## Migrations
```bash
# Start the app in development mode:
$ npm run migrate:dev

# Start the app in production mode:
$ npm run migrate:prod
```
## Running the app
```bash
# Start the app in development mode:
$ npm run dev

# Start the app in production mode:
$ npm run prod
```
## Test
```bash
# Run unit tests:
$ npm run test
```

