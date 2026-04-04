# 📦 StockPlus API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![Status](https://img.shields.io/badge/status-ativo-brightgreen?style=flat-square)
![Arquitetura](https://img.shields.io/badge/arquitetura-em%20camadas-blueviolet?style=flat-square)
![Padrão](https://img.shields.io/badge/padrão-Factory%20Method-orange?style=flat-square)
![OOP](https://img.shields.io/badge/paradigma-OOP-informational?style=flat-square)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rafafrd_StockPlus-Distribuidora&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rafafrd_StockPlus-Distribuidora)

</div>

> API RESTful para gerenciamento de **Estoque** desenvolvida com **TypeScript**, **Express** e **MySQL2**. O projeto aplica **Orientação a Objetos** com encapsulamento e padrões de projeto **Factory Method**, **Repository** e **Singleton**, organizados em uma arquitetura limpa em camadas.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#️-arquitetura)
- [Modelo de Domínio](#-modelo-de-domínio-oop)
- [Banco de Dados](#️-banco-de-dados)
- [Endpoints da API](#-endpoints-da-api)
- [Padrões de Projeto](#-padrões-de-projeto)
- [Tecnologias](#️-tecnologias)
- [Como Executar](#-como-executar)

---

## 🔎 Visão Geral

A **StockPlus API** é um sistema backend completo para gestão de estoque, cobrindo o ciclo de: cadastro de **Categorias**, **Fornecedores**, **Produtos** (com vínculo de imagem), controle de **Estoque**, **Lotes** e **Movimentações** de entrada e saída.

O projeto foi construído com foco em:

- **Separação de responsabilidades** rigorosa entre as camadas
- **Entidades ricas** com validações encapsuladas nas próprias classes de domínio
- **Factory Methods estáticos** (`criar`, `fromDB`) em todos os models
- **Código limpo** sem helpers genéricos desnecessários

---

## 📁 Estrutura do Projeto

```
├── 📁 docs
│   ├── 📄 db.sql
│   ├── ⚙️ insomnia-stockplus.json
│   └── 📝 mermaid.md
├── 📁 src
│   ├── 📁 config
│   │   ├── 📁 enum
│   │   │   └── 📄 EnvKey.ts
│   │   └── 📄 EnvVar.ts
│   ├── 📁 controllers
│   │   ├── 📄 categoria.controller.ts
│   │   ├── 📄 estoque.controller.ts
│   │   ├── 📄 fornecedor.controller.ts
│   │   ├── 📄 lote-estoque.controller.ts
│   │   ├── 📄 movimentacao.controller.ts
│   │   └── 📄 produto.controller.ts
│   ├── 📁 database
│   │   └── 📄 db.connection.ts
│   ├── 📁 models
│   │   ├── 📄 categoria.model.ts
│   │   ├── 📄 estoque.model.ts
│   │   ├── 📄 fornecedor.model.ts
│   │   ├── 📄 lote-estoque.model.ts
│   │   ├── 📄 movimentacao.model.ts
│   │   └── 📄 produto.model.ts
│   ├── 📁 repository
│   │   ├── 📄 categoria.repository.ts
│   │   ├── 📄 estoque.repository.ts
│   │   ├── 📄 fornecedor.repository.ts
│   │   ├── 📄 lote-estoque.repository.ts
│   │   ├── 📄 movimentacao.repository.ts
│   │   └── 📄 produto.repository.ts
│   ├── 📁 routes
│   │   ├── 📄 categoria.routes.ts
│   │   ├── 📄 estoque.routes.ts
│   │   ├── 📄 fornecedor.routes.ts
│   │   ├── 📄 lote-estoque.routes.ts
│   │   ├── 📄 movimentacao.routes.ts
│   │   ├── 📄 produto.routes.ts
│   │   └── 📄 router.ts
│   ├── 📁 services
│   │   ├── 📄 categoria.service.ts
│   │   ├── 📄 estoque.service.ts
│   │   ├── 📄 fornecedor.service.ts
│   │   ├── 📄 lote-estoque.service.ts
│   │   ├── 📄 movimentacao.service.ts
│   │   └── 📄 produto.service.ts
│   └── 📄 server.ts
├── ⚙️ .gitignore
├── 📝 README.md
├── 📝 claude.md
├── ⚙️ package.json
└── ⚙️ tsconfig.json
```

---

## 🏗️ Arquitetura

O projeto adota uma **arquitetura em 4 camadas** com fluxo de dependência unidirecional. O `router.ts` raiz agrega todos os sub-roteadores, e cada camada possui responsabilidade única e bem definida.

```mermaid
flowchart TD
    Client(["🌐 Cliente HTTP\n(Insomnia / Postman)"])

    subgraph ExpressLayer["⚡ Camada Express"]
        Router["📍 router.ts\n(Roteador Raiz)"]
        R1["categoria.routes.ts"]
        R2["produto.routes.ts"]
        R3["fornecedor.routes.ts"]
        R4["estoque.routes.ts"]
        R5["lote-estoque.routes.ts"]
        R6["movimentacao.routes.ts"]
        Router --> R1 & R2 & R3 & R4 & R5 & R6
    end

    subgraph ControllerLayer["🎮 Camada Controller"]
        CC["CategoriaController"]
        PC["ProdutoController"]
        FC["FornecedorController"]
        EC["EstoqueController"]
        LC["LoteEstoqueController"]
        MC["MovimentacaoController"]
    end

    subgraph ServiceLayer["⚙️ Camada Service"]
        CS["CategoriaService"]
        PS["ProdutoService"]
        FS["FornecedorService"]
        ES["EstoqueService"]
        LS["LoteEstoqueService"]
        MS["MovimentacaoService"]
    end

    subgraph RepositoryLayer["🗃️ Camada Repository"]
        CR["CategoriaRepository"]
        PR["ProdutoRepository"]
        FR["FornecedorRepository"]
        ER["EstoqueRepository"]
        LR["LoteEstoqueRepository"]
        MR["MovimentacaoRepository"]
    end

    subgraph ModelLayer["🧬 Camada Model / Domínio"]
        Categoria["Categoria\ncriar / fromDB"]
        Produto["Produto\ncriar / fromDB"]
        Fornecedor["Fornecedor\ncriar / fromDB"]
        Estoque["Estoque\ncriar / fromDB"]
        LoteEstoque["LoteEstoque\ncriar / fromDB"]
        Movimentacao["Movimentacao\ncriar / fromDB"]
    end

    DB[("🗄️ MySQL 8\nSingleton Pool")]

    Client -->|"HTTP Request"| Router
    R1 --> CC
    R2 --> PC
    R3 --> FC
    R4 --> EC
    R5 --> LC
    R6 --> MC
    CC --> CS --> CR --> Categoria
    PC --> PS --> PR --> Produto
    FC --> FS --> FR --> Fornecedor
    EC --> ES --> ER --> Estoque
    LC --> LS --> LR --> LoteEstoque
    MC --> MS --> MR --> Movimentacao
    CR & PR & FR & ER & LR & MR -->|"SQL parametrizado"| DB
```

### Responsabilidades por Camada

| Camada         | Arquivo(s)        | Responsabilidade                                                    |
| -------------- | ----------------- | ------------------------------------------------------------------- |
| **Route**      | `*.routes.ts`     | Mapear verbos HTTP para métodos do Controller                       |
| **Controller** | `*.controller.ts` | Receber requisições HTTP, validar entrada, retornar respostas       |
| **Service**    | `*.service.ts`    | Orquestrar regras de negócio, instanciar objetos via Factory Method |
| **Repository** | `*.repository.ts` | Executar queries SQL com parâmetros seguros                         |
| **Model**      | `*.model.ts`      | Representar entidades com encapsulamento e factory methods          |

---

## 🧬 Modelo de Domínio (OOP)

Todos os models seguem o padrão de entidade orientada a objeto com atributos privados, getters públicos e factory methods estáticos.

```mermaid
classDiagram
    class Categoria {
        -readonly _id: number | null
        -_dcCategoria: string
        +get Id() number | null
        +get DcCategoria() string
        +criar(dcCategoria) Categoria
        +fromDB(row: ICategoria) Categoria
    }

    class Fornecedor {
        -readonly _id: number | null
        -_dcFornecedor: string
        +get Id() number | null
        +get DcFornecedor() string
        +criar(dcFornecedor) Fornecedor
        +fromDB(row: IFornecedor) Fornecedor
    }

    class Produto {
        -readonly _id: number | null
        -_dcProduto: string
        -_vinculoImagem: string
        -_preco: number
        -_estoqueMinimo: number
        -_categoriaId: number
        -_fornecedorId: number
        +get Id() number | null
        +get Preco() number
        +get EstoqueMinimo() number
        +criar(dc, img, preco, min, catId, fornId) Produto
        +fromDB(row: IProduto) Produto
    }

    class Estoque {
        -readonly _id: number | null
        -_produtoId: number
        -_quantidadeAtual: number
        -_dtUltimaAtualizacao: Date
        +get Id() number | null
        +get QuantidadeAtual() number
        +criar(produtoId, quantidade) Estoque
        +fromDB(row: IEstoque) Estoque
    }

    class LoteEstoque {
        -readonly _id: number | null
        -_produtoId: number
        -_dtVencimento: Date | null
        -_quantidadeLote: number
        -_dtEntrada: Date
        +get Id() number | null
        +get QuantidadeLote() number
        +get DtVencimento() Date | null
        +criar(produtoId, dtVenc, qtd) LoteEstoque
        +fromDB(row: ILoteEstoque) LoteEstoque
    }

    class Movimentacao {
        -readonly _id: number | null
        -_tipoMovimento: string
        -_quantidade: number
        -_dtMovimentacao: Date
        -_loteId: number | null
        -_produtoId: number | null
        +get Id() number | null
        +get TipoMovimento() string
        +get Quantidade() number
        +criar(tipo, qtd, loteId, produtoId) Movimentacao
        +fromDB(row: IMovimentacao) Movimentacao
    }

    Categoria "1" --> "0..*" Produto : categoriza
    Fornecedor "1" --> "0..*" Produto : fornece
    Produto "1" --> "1" Estoque : controla
    Produto "1" --> "0..*" LoteEstoque : agrupa
    Produto "1" --> "0..*" Movimentacao : registra
    LoteEstoque "0..1" --> "0..*" Movimentacao : origina
```

---

## 🗄️ Banco de Dados (Database)

O banco utiliza **MySQL 8** com chaves estrangeiras, restrições de integridade e registro automático de datas via `DEFAULT CURRENT_TIMESTAMP`.

### Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    CATEGORIAS ||--o{ PRODUTOS : "categoriza"
    FORNECEDORES ||--o{ PRODUTOS : "fornece"
    PRODUTOS ||--|| ESTOQUE : "controla"
    PRODUTOS ||--o{ LOTE_ESTOQUE : "agrupa"
    PRODUTOS ||--o{ MOVIMENTACAO : "registra"
    LOTE_ESTOQUE ||--o{ MOVIMENTACAO : "origina"

    CATEGORIAS {
        int id_categoria PK
        text dc_categoria
    }
    FORNECEDORES {
        int id_fornecedor PK
        text dc_fornecedor
    }
    PRODUTOS {
        int id_produto PK
        text dc_produto
        varchar vinculo_imagem
        decimal preco
        int estoque_minimo
        int id_categoria FK
        int id_fornecedor FK
    }
    ESTOQUE {
        int id_estoque PK
        int id_produto FK
        int quantidade_atual
        timestamp dt_ultima_atualizacao
    }
    LOTE_ESTOQUE {
        int id_lote PK
        int id_produto FK
        date dt_vencimento
        int quantidade_lote
        timestamp dt_entrada
    }
    MOVIMENTACAO {
        int id_movimentacao PK
        enum tipo_movimento
        int quantidade
        timestamp dt_movimentacao
        int id_lote FK
        int id_produto FK
    }
```

### Relacionamentos

| Relacionamento             | Cardinalidade | Descrição                                       |
| -------------------------- | ------------- | ----------------------------------------------- |
| Categoria → Produto        | 1:N           | Uma categoria agrupa vários produtos            |
| Fornecedor → Produto       | 1:N           | Um fornecedor fornece vários produtos           |
| Produto → Estoque          | 1:1           | Cada produto possui um registro de estoque      |
| Produto → LoteEstoque      | 1:N           | Um produto pode ter vários lotes                |
| Produto → Movimentacao     | 1:N           | Um produto pode ter várias movimentações        |
| LoteEstoque → Movimentacao | 0..1:N        | Uma movimentação pode estar associada a um lote |

---

## 📡 Endpoints da API

### 🏷️ Categorias — `/categorias`

| Método   | Rota              | Descrição                 |
| -------- | ----------------- | ------------------------- |
| `GET`    | `/categorias`     | Lista todas as categorias |
| `GET`    | `/categorias/:id` | Busca categoria por ID    |
| `POST`   | `/categorias`     | Cria uma nova categoria   |
| `PUT`    | `/categorias/:id` | Atualiza uma categoria    |
| `DELETE` | `/categorias/:id` | Remove uma categoria      |

### 🏭 Fornecedores — `/fornecedores`

| Método   | Rota                | Descrição                   |
| -------- | ------------------- | --------------------------- |
| `GET`    | `/fornecedores`     | Lista todos os fornecedores |
| `GET`    | `/fornecedores/:id` | Busca fornecedor por ID     |
| `POST`   | `/fornecedores`     | Cria um novo fornecedor     |
| `PUT`    | `/fornecedores/:id` | Atualiza um fornecedor      |
| `DELETE` | `/fornecedores/:id` | Remove um fornecedor        |

### 📦 Produtos — `/produtos`

| Método   | Rota            | Descrição               |
| -------- | --------------- | ----------------------- |
| `GET`    | `/produtos`     | Lista todos os produtos |
| `GET`    | `/produtos/:id` | Busca produto por ID    |
| `POST`   | `/produtos`     | Cria um novo produto    |
| `PUT`    | `/produtos/:id` | Atualiza um produto     |
| `DELETE` | `/produtos/:id` | Remove um produto       |

### 🗃️ Estoque — `/estoque`

| Método   | Rota           | Descrição                           |
| -------- | -------------- | ----------------------------------- |
| `GET`    | `/estoque`     | Lista todos os registros de estoque |
| `GET`    | `/estoque/:id` | Busca estoque por ID                |
| `POST`   | `/estoque`     | Cria um registro de estoque         |
| `PUT`    | `/estoque/:id` | Atualiza um registro de estoque     |
| `DELETE` | `/estoque/:id` | Remove um registro de estoque       |

### 📋 Lotes — `/lote-estoque`

| Método   | Rota                | Descrição            |
| -------- | ------------------- | -------------------- |
| `GET`    | `/lote-estoque`     | Lista todos os lotes |
| `GET`    | `/lote-estoque/:id` | Busca lote por ID    |
| `POST`   | `/lote-estoque`     | Cria um novo lote    |
| `PUT`    | `/lote-estoque/:id` | Atualiza um lote     |
| `DELETE` | `/lote-estoque/:id` | Remove um lote       |

### 🔄 Movimentações — `/movimentacao`

| Método   | Rota                | Descrição                    |
| -------- | ------------------- | ---------------------------- |
| `GET`    | `/movimentacao`     | Lista todas as movimentações |
| `GET`    | `/movimentacao/:id` | Busca movimentação por ID    |
| `POST`   | `/movimentacao`     | Registra uma movimentação    |
| `PUT`    | `/movimentacao/:id` | Atualiza uma movimentação    |
| `DELETE` | `/movimentacao/:id` | Remove uma movimentação      |

### Mapa de Rotas

```mermaid
mindmap
  root(("🌐 API\nlocalhost:PORT"))
    /categorias
      GET - Lista todas
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /fornecedores
      GET - Lista todos
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /produtos
      GET - Lista todos
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /estoque
      GET - Lista todos
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /lote-estoque
      GET - Lista todos
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /movimentacao
      GET - Lista todas
      GET /:id - Por ID
      POST - Registrar
      PUT /:id - Editar
      DELETE /:id - Remover
```

### Códigos HTTP

```mermaid
flowchart LR
    A["Operação"] --> B{Resultado}
    B -->|"Leitura com sucesso"| C["✅ 200 OK"]
    B -->|"Criação com sucesso"| D["✅ 201 Created"]
    B -->|"Deleção com sucesso"| E["✅ 204 No Content"]
    B -->|"Body ou params inválidos"| F["⚠️ 400 Bad Request"]
    B -->|"Recurso não existe"| G["⚠️ 404 Not Found"]
    B -->|"Erro no servidor/banco"| H["❌ 500 Internal Server Error"]
```

---

## 📐 Padrões de Projeto

```mermaid
mindmap
  root(("🏛️ Padrões Aplicados"))
    Factory Method
      Categoria.criar / fromDB
      Fornecedor.criar / fromDB
      Produto.criar / fromDB
      Estoque.criar / fromDB
      LoteEstoque.criar / fromDB
      Movimentacao.criar / fromDB
    Repository Pattern
      CategoriaRepository
      FornecedorRepository
      ProdutoRepository
      EstoqueRepository
      LoteEstoqueRepository
      MovimentacaoRepository
    Singleton
      db.connection.ts
      Pool único de conexão
    Layered Architecture
      Controller
      Service
      Repository
      Model
    OOP
      Encapsulamento
        Atributos private
        Getters públicos
        Validações privadas
      Tipagem forte
        Interfaces RowDataPacket
        Factory Methods tipados
```

| Padrão                   | Onde é Aplicado                                         | Benefício                                                                      |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Factory Method**       | Métodos estáticos `criar` e `fromDB` em todos os models | Controla criação de objetos, centraliza validações, evita instâncias inválidas |
| **Repository Pattern**   | `*Repository` — um por entidade                         | Isola o SQL, torna o Service agnóstico ao banco, facilita manutenção           |
| **Singleton**            | `db.connection.ts` — pool de conexão único              | Evita múltiplas conexões abertas, otimiza uso de recursos                      |
| **Layered Architecture** | Toda a estrutura do projeto                             | Separação clara de responsabilidades e manutenibilidade                        |

---

## 🛠️ Tecnologias

### Dependências de Produção

| Pacote    | Versão | Uso                              |
| --------- | ------ | -------------------------------- |
| `express` | 5.x    | Framework HTTP                   |
| `mysql2`  | 3.x    | Driver MySQL com suporte a Pool  |
| `dotenv`  | latest | Leitura de variáveis de ambiente |

### Dependências de Desenvolvimento

| Pacote           | Versão | Uso                            |
| ---------------- | ------ | ------------------------------ |
| `typescript`     | 5.x    | Linguagem                      |
| `ts-node`        | 10.x   | Execução de TypeScript         |
| `nodemon`        | 3.x    | Live reload em desenvolvimento |
| `@types/express` | latest | Tipagens Express               |
| `@types/node`    | latest | Tipagens Node.js               |

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js (LTS)
- MySQL 8+
- npm

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=StockPlus_db
PORT=3000
```

### Instalação

```bash
# Instalar dependências
npm install

# Criar o banco de dados
# Execute o arquivo docs/db.sql no seu MySQL

# Iniciar em desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Iniciar em produção
npm start
```

### Testes com Insomnia

Importe o arquivo `docs/insomnia-stockplus.json` no Insomnia via **File → Import → From File** e siga a ordem recomendada:

```mermaid
flowchart LR
    A(["1️⃣ Categoria\nCriar categoria"]) -->
    B(["2️⃣ Fornecedor\nCriar fornecedor"]) -->
    C(["3️⃣ Produto\nCriar produto"]) -->
    D(["4️⃣ Estoque\nRegistrar estoque"]) -->
    E(["5️⃣ Lote\nCriar lote"]) -->
    F(["6️⃣ Movimentação\nRegistrar entrada/saída"])
```

> ⚠️ Siga essa ordem para evitar erros de chave estrangeira (FK).

---

<div align="center">
  <sub>Projeto Acadêmico Backend SENAI — TypeScript · Express · MySQL2 · OOP · Design Patterns</sub>
</div>
