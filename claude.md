# claude.md

## Instruções de implementação

Você deve atuar como um engenheiro de software sênior especializado em TypeScript, Node.js, Express, MySQL e arquitetura em camadas.

Trabalhe de forma autônoma, objetiva e profissional neste projeto.  
Não peça confirmação a cada etapa.  
Faça suposições razoáveis quando necessário, mas sempre respeite a estrutura já existente do projeto.

## Convenções do ambiente

- Use `@` para arquivos
- Use `/` para comandos
- Use `$` para skills

## Regra principal

Reescreva integralmente todos os arquivos `.ts` já existentes da estrutura informada.

Considere que o código atual pode estar incorreto e deve ser substituído.  
Não preserve implementações problemáticas anteriores.  
Não crie novos arquivos fora da estrutura já existente.  
Não invente abstrações novas.  
Não faça remendos.  
Não gere helpers desnecessários.

## Fonte da verdade

- O schema oficial está em `@docs/db.sql`
- O diagrama de apoio está em `@docs/mermaid.md`
- Se houver divergência, priorize `@docs/db.sql`

## Arquitetura obrigatória

A implementação deve respeitar esta divisão:

- `models`: entidades e interfaces do domínio
- `repository`: acesso ao banco e queries SQL
- `services`: regra de negócio
- `controllers`: HTTP, validação de entrada e resposta
- `routes`: mapeamento das rotas
- `database`: conexão com MySQL
- `config`: leitura de variáveis de ambiente
- `server.ts`: bootstrap da aplicação

## Proibições

- Não criar novos helpers genéricos
- Não criar camada extra
- Não criar utilitários desnecessários
- Não espalhar lógica em arquivos auxiliares
- Não usar ORM
- Não mascarar arquitetura ruim com helpers
- Não centralizar lógica em arquivos `helper`
- Não depender de middleware global para esconder erros de controller

## Padrão obrigatório para models

Todos os models devem seguir o padrão de entidade orientada a objeto com:

- interface para linha vinda do banco
- classe concreta
- atributos privados
- getters públicos
- comportamento de domínio quando fizer sentido
- factory methods estáticos obrigatórios:
  - `criar(...)`
  - `fromDB(...)`

### Exemplo de padrão esperado

- interface extendendo `RowDataPacket`
- classe com atributos privados
- construtor claro
- getters nomeados
- factory para criação nova
- factory para reconstrução a partir do banco

Exemplo conceitual:

```ts
import { RowDataPacket } from "mysql2";

export interface IEntidade extends RowDataPacket {
  id_entidade: number;
  nome: string;
}

export class Entidade {
  private readonly _id: number | null;
  private readonly _nome: string;

  constructor(id: number | null, nome: string) {
    this._id = id;
    this._nome = nome;
  }

  get Id(): number | null {
    return this._id;
  }

  get Nome(): string {
    return this._nome;
  }

  static criar(nome: string): Entidade {
    return new Entidade(null, nome);
  }

  static fromDB(row: IEntidade): Entidade {
    return new Entidade(row.id_entidade, row.nome);
  }
}
```

## Padrão obrigatório para controllers

Controllers devem:

- ser classes
- ter dependência `private readonly` do service
- instanciar o service no constructor
- usar métodos arrow function
- usar `async/await`
- ter `try/catch` em todos os métodos
- validar `req.params`, `req.body` e `req.query` no próprio controller
- retornar `Promise<void>`
- responder com JSON padronizado
- não jogar tratamento de erro para helper genérico
- não depender de middleware global para tratar erros principais

### Padrão esperado

```ts
listarTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const dados = await this._service.listarTodos();
    res.status(200).json({ mensagem: "Sucesso.", recurso: dados });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};
```

## Padrão obrigatório para services

Services devem:

- ser classes
- conter a regra de negócio
- depender de repositories
- usar `private readonly`
- retornar models do domínio
- lançar `Error` com mensagens claras quando houver falhas de regra de negócio
- não acessar `Request` nem `Response`

## Padrão obrigatório para repository

Repositories devem:

- ser classes
- acessar o banco diretamente com `mysql2`
- conter SQL explícito
- mapear resultado do banco para model com `fromDB(...)`
- usar transação quando fizer sentido
- não conter regra de negócio
- não retornar objeto cru quando houver model correspondente

## Rotas

As rotas devem:

- ficar em `@src/routes`
- instanciar controllers
- mapear endpoints REST
- usar um `router.ts` central agregando todas as rotas

## CRUD obrigatório

Para cada entidade principal, criar:

- `POST /recurso`
- `GET /recurso`
- `GET /recurso/:id`
- `PUT /recurso/:id`
- `DELETE /recurso/:id`

## Banco de dados

- Use `mysql2`
- Use SQL direto
- Não use ORM
- A conexão deve ficar em `@src/database/db.connection.ts`

## Variáveis de ambiente

Implemente leitura clara de variáveis de ambiente em:

- `@src/config/enum/EnvKey.ts`
- `@src/config/EnvVar.ts`

Considere:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT`

## Regras de implementação

- Linguagem e nomes em português
- Tipagem forte
- Sem `any` desnecessário
- Sem arquivos gigantes
- Sem abstrações desnecessárias
- Sem helpers genéricos
- Tratamento de erro principal dentro dos controllers com `try/catch`
- Services fazem regra de negócio
- Repositories fazem persistência
- Models representam o domínio
- Controllers fazem HTTP e validação

## Importante sobre os arquivos helper já existentes

Os arquivos abaixo não devem virar o centro da arquitetura:

- `@src/controllers/controller.helper.ts`
- `@src/database/mysql-error.helper.ts`
- `@src/models/model.helper.ts`
- `@src/services/service.helper.ts`

Se precisar reescrevê-los, mantenha-os mínimos.
Não concentre lógica neles.
A prioridade é manter a lógica dentro de `controller`, `service`, `repository` e `model`.

## Resultado esperado

- Reescrever todos os arquivos `.ts` da estrutura
- Corrigir erros arquiteturais existentes
- Implementar CRUD completo
- Garantir consistência entre model, repository, service, controller e route
- Garantir que o projeto compile
- Mostrar os arquivos reescritos
- Listar endpoints criados
- Informar dependências necessárias
- Informar comandos para rodar o projeto

## Regra final

Não responda apenas com explicação.
Reescreva de fato os arquivos.
Não crie helpers desnecessários.
Não empurre erro para middleware genérico.
Use `try/catch` nos controllers.
Use factory methods nos models no padrão solicitado.
