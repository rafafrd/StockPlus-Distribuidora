import { ResultSetHeader } from 'mysql2/promise';
import { db, ExecutorQuery } from '../database/db.connection';
import { Fornecedor, IFornecedor } from '../models/fornecedor.model';

export class FornecedorRepository {
  public async listarTodos(executor: ExecutorQuery = db): Promise<Fornecedor[]> {
    const [rows] = await executor.query<IFornecedor[]>(
      'SELECT id_fornecedor, dc_fornecedor FROM Fornecedores ORDER BY id_fornecedor ASC',
    );

    return rows.map((row) => Fornecedor.fromDB(row));
  }

  public async buscarPorId(
    idFornecedor: number,
    executor: ExecutorQuery = db,
  ): Promise<Fornecedor | null> {
    const [rows] = await executor.execute<IFornecedor[]>(
      'SELECT id_fornecedor, dc_fornecedor FROM Fornecedores WHERE id_fornecedor = ? LIMIT 1',
      [idFornecedor],
    );

    if (rows.length === 0) {
      return null;
    }

    return Fornecedor.fromDB(rows[0]);
  }

  public async criar(fornecedor: Fornecedor, executor: ExecutorQuery = db): Promise<Fornecedor> {
    const [resultado] = await executor.execute<ResultSetHeader>(
      'INSERT INTO Fornecedores (dc_fornecedor) VALUES (?)',
      [fornecedor.DescricaoFornecedor],
    );

    const fornecedorCriado = await this.buscarPorId(resultado.insertId, executor);

    if (!fornecedorCriado) {
      throw new Error('Nao foi possivel recuperar o fornecedor criado.');
    }

    return fornecedorCriado;
  }

  public async atualizar(
    fornecedor: Fornecedor,
    executor: ExecutorQuery = db,
  ): Promise<Fornecedor> {
    await executor.execute<ResultSetHeader>(
      'UPDATE Fornecedores SET dc_fornecedor = ? WHERE id_fornecedor = ?',
      [fornecedor.DescricaoFornecedor, fornecedor.IdFornecedor],
    );

    const fornecedorAtualizado = await this.buscarPorId(fornecedor.IdFornecedor as number, executor);

    if (!fornecedorAtualizado) {
      throw new Error('Nao foi possivel recuperar o fornecedor atualizado.');
    }

    return fornecedorAtualizado;
  }

  public async deletar(idFornecedor: number, executor: ExecutorQuery = db): Promise<void> {
    await executor.execute<ResultSetHeader>('DELETE FROM Fornecedores WHERE id_fornecedor = ?', [
      idFornecedor,
    ]);
  }
}
