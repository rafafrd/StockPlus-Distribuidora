import { Estoque } from '../models/estoque.model';
import { EstoqueRepository } from '../repository/estoque.repository';
import { ProdutoRepository } from '../repository/produto.repository';

export class EstoqueService {
  private readonly _repository: EstoqueRepository;
  private readonly _produtoRepository: ProdutoRepository;

  constructor() {
    this._repository = new EstoqueRepository();
    this._produtoRepository = new ProdutoRepository();
  }

  public async listarTodos(): Promise<Estoque[]> {
    return this._repository.listarTodos();
  }

  public async buscarPorId(idEstoque: number): Promise<Estoque> {
    const estoque = await this._repository.buscarPorId(idEstoque);

    if (!estoque) {
      throw new Error('Estoque nao encontrado.');
    }

    return estoque;
  }

  public async criar(idProduto: number, quantidadeAtual: number): Promise<Estoque> {
    await this.validarProduto(idProduto);
    await this.validarUnicidade(idProduto);

    const estoque = Estoque.criar(idProduto, quantidadeAtual);
    return this._repository.criar(estoque);
  }

  public async atualizar(
    idEstoque: number,
    idProduto: number,
    quantidadeAtual: number,
  ): Promise<Estoque> {
    await this.validarProduto(idProduto);

    const estoqueAtual = await this.buscarPorId(idEstoque);
    const estoqueDoProduto = await this._repository.buscarPorProduto(idProduto);

    if (estoqueDoProduto && estoqueDoProduto.IdEstoque !== estoqueAtual.IdEstoque) {
      throw new Error('Ja existe um estoque para o produto informado.');
    }

    const estoqueAtualizado = estoqueAtual.atualizar(idProduto, quantidadeAtual);
    return this._repository.atualizar(estoqueAtualizado);
  }

  public async deletar(idEstoque: number): Promise<void> {
    await this.buscarPorId(idEstoque);
    await this._repository.deletar(idEstoque);
  }

  private async validarProduto(idProduto: number): Promise<void> {
    const produto = await this._produtoRepository.buscarPorId(idProduto);

    if (!produto) {
      throw new Error('Produto informado nao existe.');
    }
  }

  private async validarUnicidade(idProduto: number): Promise<void> {
    const estoque = await this._repository.buscarPorProduto(idProduto);

    if (estoque) {
      throw new Error('Ja existe um estoque para o produto informado.');
    }
  }
}
