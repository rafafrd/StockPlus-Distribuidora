import { ResultSetHeader } from 'mysql2/promise';
import { db, ExecutorQuery } from '../database/db.connection';
import { IMovimentacao, Movimentacao } from '../models/movimentacao.model';

export class MovimentacaoRepository {
  // Listar todas as movimentações
  public async listarTodos(executor: ExecutorQuery = db): Promise<Movimentacao[]> {
    const [rows] = await executor.query<IMovimentacao[]>(
      `SELECT
         id_movimentacao,
         tipo_movimento,
         quantidade,
         dt_movimentacao,
         id_lote,
         id_produto
       FROM Movimentacao
       ORDER BY id_movimentacao ASC`,
    );

    return rows.map((row) => Movimentacao.fromDB(row));
  }

  public async buscarPorId(
    idMovimentacao: number,
    executor: ExecutorQuery = db,
  ): Promise<Movimentacao | null> {
    const [rows] = await executor.execute<IMovimentacao[]>(
      `SELECT
         id_movimentacao,
         tipo_movimento,
         quantidade,
         dt_movimentacao,
         id_lote,
         id_produto
       FROM Movimentacao
       WHERE id_movimentacao = ?
       LIMIT 1`,
      [idMovimentacao],
    );

    if (rows.length === 0) {
      return null;
    }

    return Movimentacao.fromDB(rows[0]);
  }

  public async criar(
    movimentacao: Movimentacao,
    executor: ExecutorQuery = db,
  ): Promise<Movimentacao> {
    const [resultado] = await executor.execute<ResultSetHeader>(
      `INSERT INTO Movimentacao (
         tipo_movimento,
         quantidade,
         dt_movimentacao,
         id_lote,
         id_produto
       ) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)`,
      [
        movimentacao.TipoMovimento,
        movimentacao.Quantidade,
        movimentacao.IdLote,
        movimentacao.IdProduto,
      ],
    );

    const movimentacaoCriada = await this.buscarPorId(resultado.insertId, executor);

    if (!movimentacaoCriada) {
      throw new Error('Nao foi possivel recuperar a movimentacao criada.');
    }

    return movimentacaoCriada;
  }

  public async atualizar(
    movimentacao: Movimentacao,
    executor: ExecutorQuery = db,
  ): Promise<Movimentacao> {
    await executor.execute<ResultSetHeader>(
      `UPDATE Movimentacao
       SET
         tipo_movimento = ?,
         quantidade = ?,
         id_lote = ?,
         id_produto = ?
       WHERE id_movimentacao = ?`,
      [
        movimentacao.TipoMovimento,
        movimentacao.Quantidade,
        movimentacao.IdLote,
        movimentacao.IdProduto,
        movimentacao.IdMovimentacao,
      ],
    );

    const movimentacaoAtualizada = await this.buscarPorId(
      movimentacao.IdMovimentacao as number,
      executor,
    );

    if (!movimentacaoAtualizada) {
      throw new Error('Nao foi possivel recuperar a movimentacao atualizada.');
    }

    return movimentacaoAtualizada;
  }

  public async deletar(idMovimentacao: number, executor: ExecutorQuery = db): Promise<void> {
    await executor.execute<ResultSetHeader>('DELETE FROM Movimentacao WHERE id_movimentacao = ?', [
      idMovimentacao,
    ]);
  }
}
