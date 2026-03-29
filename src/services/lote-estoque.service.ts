import { LoteEstoque } from '../models/lote-estoque.model';
import { LoteEstoqueRepository } from '../repository/lote-estoque.repository';
import { ProdutoRepository } from '../repository/produto.repository';

export class LoteEstoqueService {
  private readonly _repository: LoteEstoqueRepository;
  private readonly _produtoRepository: ProdutoRepository;

  constructor() {
    this._repository = new LoteEstoqueRepository();
    this._produtoRepository = new ProdutoRepository();
  }

  public async listarTodos(): Promise<LoteEstoque[]> {
    return this._repository.listarTodos();
  }

  public async buscarPorId(idLote: number): Promise<LoteEstoque> {
    const lote = await this._repository.buscarPorId(idLote);

    if (!lote) {
      throw new Error('Lote de estoque nao encontrado.');
    }

    return lote;
  }

  public async criar(
    idProduto: number,
    dataVencimento: string | null,
    quantidadeLote: number | null,
  ): Promise<LoteEstoque> {
    await this.validarProduto(idProduto);

    const lote = LoteEstoque.criar(idProduto, dataVencimento, quantidadeLote);
    return this._repository.criar(lote);
  }

  public async atualizar(
    idLote: number,
    idProduto: number,
    dataVencimento: string | null,
    quantidadeLote: number,
  ): Promise<LoteEstoque> {
    await this.validarProduto(idProduto);

    const loteAtual = await this.buscarPorId(idLote);
    const loteAtualizado = loteAtual.atualizar(idProduto, dataVencimento, quantidadeLote);

    return this._repository.atualizar(loteAtualizado);
  }

  public async deletar(idLote: number): Promise<void> {
    await this.buscarPorId(idLote);

    try {
      await this._repository.deletar(idLote);
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new Error(
          'Nao foi possivel remover o lote porque existem movimentacoes vinculadas.',
        );
      }

      throw error;
    }
  }

  private async validarProduto(idProduto: number): Promise<void> {
    const produto = await this._produtoRepository.buscarPorId(idProduto);

    if (!produto) {
      throw new Error('Produto informado nao existe.');
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
