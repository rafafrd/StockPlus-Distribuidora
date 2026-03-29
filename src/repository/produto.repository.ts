import { ResultSetHeader } from 'mysql2/promise';
import { db, ExecutorQuery } from '../database/db.connection';
import { IProduto, Produto } from '../models/produto.model';

export class ProdutoRepository {
  public async listarTodos(executor: ExecutorQuery = db): Promise<Produto[]> {
    const [rows] = await executor.query<IProduto[]>(
      `SELECT
         id_produto,
         dc_produto,
         vinculo_imagem,
         preco,
         estoque_minimo,
         id_categoria,
         id_fornecedor
       FROM Produtos
       ORDER BY id_produto ASC`,
    );

    return rows.map((row) => Produto.fromDB(row));
  }

  public async buscarPorId(idProduto: number, executor: ExecutorQuery = db): Promise<Produto | null> {
    const [rows] = await executor.execute<IProduto[]>(
      `SELECT
         id_produto,
         dc_produto,
         vinculo_imagem,
         preco,
         estoque_minimo,
         id_categoria,
         id_fornecedor
       FROM Produtos
       WHERE id_produto = ?
       LIMIT 1`,
      [idProduto],
    );

    if (rows.length === 0) {
      return null;
    }

    return Produto.fromDB(rows[0]);
  }

  public async criar(produto: Produto, executor: ExecutorQuery = db): Promise<Produto> {
    const [resultado] = await executor.execute<ResultSetHeader>(
      `INSERT INTO Produtos (
         dc_produto,
         vinculo_imagem,
         preco,
         estoque_minimo,
         id_categoria,
         id_fornecedor
       ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        produto.DescricaoProduto,
        produto.VinculoImagem,
        produto.Preco,
        produto.EstoqueMinimo,
        produto.IdCategoria,
        produto.IdFornecedor,
      ],
    );

    const produtoCriado = await this.buscarPorId(resultado.insertId, executor);

    if (!produtoCriado) {
      throw new Error('Nao foi possivel recuperar o produto criado.');
    }

    return produtoCriado;
  }

  public async atualizar(produto: Produto, executor: ExecutorQuery = db): Promise<Produto> {
    await executor.execute<ResultSetHeader>(
      `UPDATE Produtos
       SET
         dc_produto = ?,
         vinculo_imagem = ?,
         preco = ?,
         estoque_minimo = ?,
         id_categoria = ?,
         id_fornecedor = ?
       WHERE id_produto = ?`,
      [
        produto.DescricaoProduto,
        produto.VinculoImagem,
        produto.Preco,
        produto.EstoqueMinimo,
        produto.IdCategoria,
        produto.IdFornecedor,
        produto.IdProduto,
      ],
    );

    const produtoAtualizado = await this.buscarPorId(produto.IdProduto as number, executor);

    if (!produtoAtualizado) {
      throw new Error('Nao foi possivel recuperar o produto atualizado.');
    }

    return produtoAtualizado;
  }

  public async deletar(idProduto: number, executor: ExecutorQuery = db): Promise<void> {
    await executor.execute<ResultSetHeader>('DELETE FROM Produtos WHERE id_produto = ?', [idProduto]);
  }
}
