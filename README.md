
# Bytebank-Investments

Este projeto é um **microfrontend** da aplicação principal **Bytebank Web**, responsável pelo módulo de investimentos.

O microfrontend foi criado utilizando **React** e **Create React App**, e está integrado ao projeto principal através de **Single SPA**.

## 📦 Tecnologias utilizadas

- React
- TypeScript
- Single SPA
- Webpack

---

## 🚀 Como iniciar o projeto

Clone o repositório e instale as dependências:

```bash
yarn install
```

Inicie a aplicação localmente:

```bash
yarn start
```

A aplicação estará disponível em: [http://localhost:3001](http://localhost:3001)

---

## 🔌 Integração com o container principal

Este microfrontend é exposto como um módulo remoto para o container principal **Bytebank Web**, que importa este módulo

> Lembre-se de rodar o microfrontend antes de acessar a aplicação principal.

---

## 📁 Scripts disponíveis

No diretório do projeto, você pode rodar:

### `yarn start`

Roda a aplicação em modo desenvolvimento.<br>
Abra [http://localhost:3001](http://localhost:3001) no navegador.

### `yarn build`

Cria a versão de produção da aplicação no diretório `build`.

---

## 🧩 Sobre o projeto Bytebank

Bytebank é uma aplicação financeira completa desenvolvida com foco em arquitetura de microfrontends. O módulo de investimentos é apenas uma das partes desacopladas da aplicação principal.
