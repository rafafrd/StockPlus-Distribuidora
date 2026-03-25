## Contextualização

A empresa **StockPlus Distribuidora**, atua no setor de **comercialização e distribuição de produtos variados para o varejo**. Com o crescimento do número de clientes e fornecedores, a empresa passou a lidar com um volume cada vez maior de produtos armazenados, tornando essencial um controle eficiente de estoque, entradas e saídas de mercadorias.

Atualmente, a StockPlus utiliza um **sistema legado** para o cadastro de produtos e controle de estoque, desenvolvido sem uma arquitetura bem estruturada. Esse sistema apresenta limitações na manutenção, dificuldade para a inclusão de novas funcionalidades e pouca flexibilidade para atender regras de negócio mais complexas, como o **controle de validade dos produtos**, **rastreamento de movimentações** e **geração de alertas**.

Diante desse cenário, a empresa necessita do desenvolvimento de um **novo sistema de gestão de estoque**, fundamentado nos princípios da **Programação Orientada a Objetos (POO)** e no uso de **padrões de projeto**, visando maior organização, extensibilidade e reutilização do código.

### Funcionalidades mínimas do sistema

O sistema deverá contemplar, no mínimo, as seguintes funcionalidades:

- Cadastro, edição, consulta e exclusão de produtos;
- Controle de estoque com registro de entradas e saídas de mercadorias;
- Associação de produtos a categorias e fornecedores;
- Controle de datas de vencimento, permitindo a identificação de produtos próximos ou com validade expirada;
- Registro do histórico de movimentações de estoque (entrada e saída);
- Alerta de estoque próximo ao mínimo;
- Alerta dos produtos com data de vencimento faltando **90** e **45 dias** para vencer;
- Relatórios de produtos em estoque.

### Requisitos de projeto

A solução deve ser projetada de forma a permitir a **evolução do sistema**, possibilitando a inclusão de novas regras de negócio, relatórios e formas de controle sem impactar significativamente o código existente.
