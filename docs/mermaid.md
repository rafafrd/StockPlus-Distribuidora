classDiagram

class Produto {
  +id_produto: int
  +dc_produto: string
  +descricao: string
  +vinculo_imagem: string
  +preco: decimal
  +estoque_minimo: int
  +atualizarPreco(novoPreco)
  +verificarEstoqueMinimo()
}

class Categoria {
  +id_categoria: int
  +dc_categoria: string
}

class Fornecedor {
  +id_fornecedor: int
  +dc_fornecedor: string
}

class Estoque {
  +id_estoque: int
  +quantidade_atual: int
  +dt_ultima_atualizacao: datetime
  +somarQuantidade(qtd)
  +subtrairQuantidade(qtd)
}

class LoteEstoque {
  +id_lote: int
  +quantidade_lote: int
  +dt_vencimento: date
  +dt_entrada: date
  +verificarVencimento()
}

class Movimentacao {
  +id_movimentacao: int
  +tipo_movimentacao: string
  +quantidade: int
  +dt_movimentacao: datetime
  +observacao: string
  +registrarEntrada()
  +registrarSaida()
}

Categoria "1" --> "0..*" Produto
Fornecedor "1" --> "0..*" Produto
Produto "1" --> "1" Estoque
Produto "1" --> "0..*" LoteEstoque
Produto "1" --> "0..*" Movimentacao
LoteEstoque "0..1" --> "0..*" Movimentacao