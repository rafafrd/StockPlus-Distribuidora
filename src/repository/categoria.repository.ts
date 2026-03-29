import { ResultSetHeader } from 'mysql2/promise';
import { db, ExecutorQuery } from '../database/db.connection';
import { Categoria, ICategoria } from '../models/categoria.model';

export class CategoriaRepository {
  public async listarTodos(executor: ExecutorQuery = db): Promise<Categoria[]> {
    const [rows] = await executor.query<ICategoria[]>(
      'SELECT id_categoria, dc_categoria FROM Categorias ORDER BY id_categoria ASC',
    );

    return rows.map((row) => Categoria.fromDB(row));
  }

  public async buscarPorId(idCategoria: number, executor: ExecutorQuery = db): Promise<Categoria | null> {
    const [rows] = await executor.execute<ICategoria[]>(
      'SELECT id_categoria, dc_categoria FROM Categorias WHERE id_categoria = ? LIMIT 1',
      [idCategoria],
    );

    if (rows.length === 0) {
      return null;
    }

    return Categoria.fromDB(rows[0]);
  }

  public async criar(categoria: Categoria, executor: ExecutorQuery = db): Promise<Categoria> {
    const [resultado] = await executor.execute<ResultSetHeader>(
      'INSERT INTO Categorias (dc_categoria) VALUES (?)',
      [categoria.DescricaoCategoria],
    );

    const categoriaCriada = await this.buscarPorId(resultado.insertId, executor);

    if (!categoriaCriada) {
      throw new Error('Nao foi possivel recuperar a categoria criada.');
    }

    return categoriaCriada;
  }

  public async atualizar(categoria: Categoria, executor: ExecutorQuery = db): Promise<Categoria> {
    await executor.execute<ResultSetHeader>(
      'UPDATE Categorias SET dc_categoria = ? WHERE id_categoria = ?',
      [categoria.DescricaoCategoria, categoria.IdCategoria],
    );

    const categoriaAtualizada = await this.buscarPorId(categoria.IdCategoria as number, executor);

    if (!categoriaAtualizada) {
      throw new Error('Nao foi possivel recuperar a categoria atualizada.');
    }

    return categoriaAtualizada;
  }

  public async deletar(idCategoria: number, executor: ExecutorQuery = db): Promise<void> {
    await executor.execute<ResultSetHeader>('DELETE FROM Categorias WHERE id_categoria = ?', [
      idCategoria,
    ]);
  }
}
