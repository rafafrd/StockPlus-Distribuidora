import { ResultSetHeader } from 'mysql2/promise';
import { db, ExecutorQuery } from '../database/db.connection';
import { Estoque, IEstoque } from '../models/estoque.model';

export class EstoqueRepository {
  public async listarTodos(executor: ExecutorQuery = db): Promise<Estoque[]> {
    const [rows] = await executor.query<IEstoque[]>(
      `SELECT
         id_estoque,
         id_produto,
         quantidade_atual,
         dt_ultima_atualizacao
       FROM Estoque
       ORDER BY id_estoque ASC`,
    );

    return rows.map((row) => Estoque.fromDB(row));
  }

  public async buscarPorId(idEstoque: number, executor: ExecutorQuery = db): Promise<Estoque | null> {
    const [rows] = await executor.execute<IEstoque[]>(
      `SELECT
         id_estoque,
         id_produto,
         quantidade_atual,
         dt_ultima_atualizacao
       FROM Estoque
       WHERE id_estoque = ?
       LIMIT 1`,
      [idEstoque],
    );

    if (rows.length === 0) {
      return null;
    }

    return Estoque.fromDB(rows[0]);
  }

  public async buscarPorProduto(
    idProduto: number,
    executor: ExecutorQuery = db,
  ): Promise<Estoque | null> {
    const [rows] = await executor.execute<IEstoque[]>(
      `SELECT
         id_estoque,
         id_produto,
         quantidade_atual,
         dt_ultima_atualizacao
       FROM Estoque
       WHERE id_produto = ?
       LIMIT 1`,
      [idProduto],
    );

    if (rows.length === 0) {
      return null;
    }

    return Estoque.fromDB(rows[0]);
  }

  public async criar(estoque: Estoque, executor: ExecutorQuery = db): Promise<Estoque> {
    const [resultado] = await executor.execute<ResultSetHeader>(
      `INSERT INTO Estoque (id_produto, quantidade_atual, dt_ultima_atualizacao)
       VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [estoque.IdProduto, estoque.QuantidadeAtual],
    );

    const estoqueCriado = await this.buscarPorId(resultado.insertId, executor);

    if (!estoqueCriado) {
      throw new Error('Nao foi possivel recuperar o estoque criado.');
    }

    return estoqueCriado;
  }

  public async atualizar(estoque: Estoque, executor: ExecutorQuery = db): Promise<Estoque> {
    await executor.execute<ResultSetHeader>(
      `UPDATE Estoque
       SET
         id_produto = ?,
         quantidade_atual = ?,
         dt_ultima_atualizacao = CURRENT_TIMESTAMP
       WHERE id_estoque = ?`,
      [estoque.IdProduto, estoque.QuantidadeAtual, estoque.IdEstoque],
    );

    const estoqueAtualizado = await this.buscarPorId(estoque.IdEstoque as number, executor);

    if (!estoqueAtualizado) {
      throw new Error('Nao foi possivel recuperar o estoque atualizado.');
    }

    return estoqueAtualizado;
  }

  public async deletar(idEstoque: number, executor: ExecutorQuery = db): Promise<void> {
    await executor.execute<ResultSetHeader>('DELETE FROM Estoque WHERE id_estoque = ?', [idEstoque]);
  }
}
