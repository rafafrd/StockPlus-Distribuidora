import { Fornecedor } from '../models/fornecedor.model';
import { FornecedorRepository } from '../repository/fornecedor.repository';

export class FornecedorService {
  private readonly _repository: FornecedorRepository;

  constructor() {
    this._repository = new FornecedorRepository();
  }

  public async listarTodos(): Promise<Fornecedor[]> {
    return this._repository.listarTodos();
  }

  public async buscarPorId(idFornecedor: number): Promise<Fornecedor> {
    const fornecedor = await this._repository.buscarPorId(idFornecedor);

    if (!fornecedor) {
      throw new Error('Fornecedor nao encontrado.');
    }

    return fornecedor;
  }

  public async criar(descricaoFornecedor: string): Promise<Fornecedor> {
    const fornecedor = Fornecedor.criar(descricaoFornecedor);
    return this._repository.criar(fornecedor);
  }

  public async atualizar(idFornecedor: number, descricaoFornecedor: string): Promise<Fornecedor> {
    const fornecedorAtual = await this.buscarPorId(idFornecedor);
    const fornecedorAtualizado = fornecedorAtual.atualizar(descricaoFornecedor);
    return this._repository.atualizar(fornecedorAtualizado);
  }

  public async deletar(idFornecedor: number): Promise<void> {
    await this.buscarPorId(idFornecedor);

    try {
      await this._repository.deletar(idFornecedor);
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new Error(
          'Nao foi possivel remover o fornecedor porque existem produtos vinculados.',
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
