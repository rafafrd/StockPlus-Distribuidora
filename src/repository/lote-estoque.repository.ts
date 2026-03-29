import { ResultSetHeader } from 'mysql2/promise';
import { db, ExecutorQuery } from '../database/db.connection';
import { ILoteEstoque, LoteEstoque } from '../models/lote-estoque.model';

export class LoteEstoqueRepository {
  public async listarTodos(executor: ExecutorQuery = db): Promise<LoteEstoque[]> {
    const [rows] = await executor.query<ILoteEstoque[]>(
      `SELECT
         id_lote,
         id_produto,
         dt_vencimento,
         quantidade_lote,
         dt_entrada
       FROM Lote_Estoque
       ORDER BY id_lote ASC`,
    );

    return rows.map((row) => LoteEstoque.fromDB(row));
  }

  public async buscarPorId(idLote: number, executor: ExecutorQuery = db): Promise<LoteEstoque | null> {
    const [rows] = await executor.execute<ILoteEstoque[]>(
      `SELECT
         id_lote,
         id_produto,
         dt_vencimento,
         quantidade_lote,
         dt_entrada
       FROM Lote_Estoque
       WHERE id_lote = ?
       LIMIT 1`,
      [idLote],
    );

    if (rows.length === 0) {
      return null;
    }

    return LoteEstoque.fromDB(rows[0]);
  }

  public async listarPorProduto(
    idProduto: number,
    executor: ExecutorQuery = db,
  ): Promise<LoteEstoque[]> {
    const [rows] = await executor.execute<ILoteEstoque[]>(
      `SELECT
         id_lote,
         id_produto,
         dt_vencimento,
         quantidade_lote,
         dt_entrada
       FROM Lote_Estoque
       WHERE id_produto = ?
       ORDER BY id_lote ASC`,
      [idProduto],
    );

    return rows.map((row) => LoteEstoque.fromDB(row));
  }

  public async criar(lote: LoteEstoque, executor: ExecutorQuery = db): Promise<LoteEstoque> {
    const [resultado] = await executor.execute<ResultSetHeader>(
      `INSERT INTO Lote_Estoque (id_produto, dt_vencimento, quantidade_lote, dt_entrada)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [lote.IdProduto, lote.DataVencimento, lote.QuantidadeLote],
    );

    const loteCriado = await this.buscarPorId(resultado.insertId, executor);

    if (!loteCriado) {
      throw new Error('Nao foi possivel recuperar o lote criado.');
    }

    return loteCriado;
  }

  public async atualizar(lote: LoteEstoque, executor: ExecutorQuery = db): Promise<LoteEstoque> {
    await executor.execute<ResultSetHeader>(
      `UPDATE Lote_Estoque
       SET
         id_produto = ?,
         dt_vencimento = ?,
         quantidade_lote = ?
       WHERE id_lote = ?`,
      [lote.IdProduto, lote.DataVencimento, lote.QuantidadeLote, lote.IdLote],
    );

    const loteAtualizado = await this.buscarPorId(lote.IdLote as number, executor);

    if (!loteAtualizado) {
      throw new Error('Nao foi possivel recuperar o lote atualizado.');
    }

    return loteAtualizado;
  }

  public async deletar(idLote: number, executor: ExecutorQuery = db): Promise<void> {
    await executor.execute<ResultSetHeader>('DELETE FROM Lote_Estoque WHERE id_lote = ?', [idLote]);
  }
}
