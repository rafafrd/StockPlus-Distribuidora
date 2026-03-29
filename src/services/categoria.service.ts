import { Categoria } from '../models/categoria.model';
import { CategoriaRepository } from '../repository/categoria.repository';

export class CategoriaService {
  private readonly _repository: CategoriaRepository;

  constructor() {
    this._repository = new CategoriaRepository();
  }

  public async listarTodos(): Promise<Categoria[]> {
    return this._repository.listarTodos();
  }

  public async buscarPorId(idCategoria: number): Promise<Categoria> {
    const categoria = await this._repository.buscarPorId(idCategoria);

    if (!categoria) {
      throw new Error('Categoria nao encontrada.');
    }

    return categoria;
  }

  public async criar(descricaoCategoria: string): Promise<Categoria> {
    const categoria = Categoria.criar(descricaoCategoria);
    return this._repository.criar(categoria);
  }

  public async atualizar(idCategoria: number, descricaoCategoria: string): Promise<Categoria> {
    const categoriaAtual = await this.buscarPorId(idCategoria);
    const categoriaAtualizada = categoriaAtual.atualizar(descricaoCategoria);
    return this._repository.atualizar(categoriaAtualizada);
  }

  public async deletar(idCategoria: number): Promise<void> {
    await this.buscarPorId(idCategoria);

    try {
      await this._repository.deletar(idCategoria);
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new Error(
          'Nao foi possivel remover a categoria porque existem produtos vinculados.',
        );
      }

      throw error;
    }
  }

  private isForeignKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'ER_ROW_IS_REFERENCED_2'
    );
  }
}
