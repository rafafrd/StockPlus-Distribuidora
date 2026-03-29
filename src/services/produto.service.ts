import { Produto } from '../models/produto.model';
import { CategoriaRepository } from '../repository/categoria.repository';
import { FornecedorRepository } from '../repository/fornecedor.repository';
import { ProdutoRepository } from '../repository/produto.repository';

export class ProdutoService {
  private readonly _repository: ProdutoRepository;
  private readonly _categoriaRepository: CategoriaRepository;
  private readonly _fornecedorRepository: FornecedorRepository;

  constructor() {
    this._repository = new ProdutoRepository();
    this._categoriaRepository = new CategoriaRepository();
    this._fornecedorRepository = new FornecedorRepository();
  }

  public async listarTodos(): Promise<Produto[]> {
    return this._repository.listarTodos();
  }

  public async buscarPorId(idProduto: number): Promise<Produto> {
    const produto = await this._repository.buscarPorId(idProduto);

    if (!produto) {
      throw new Error('Produto nao encontrado.');
    }

    return produto;
  }

  public async criar(
    descricaoProduto: string,
    vinculoImagem: string,
    preco: number,
    estoqueMinimo: number,
    idCategoria: number,
    idFornecedor: number,
  ): Promise<Produto> {
    await this.validarRelacionamentos(idCategoria, idFornecedor);

    const produto = Produto.criar(
      descricaoProduto,
      vinculoImagem,
      preco,
      estoqueMinimo,
      idCategoria,
      idFornecedor,
    );

    return this._repository.criar(produto);
  }

  public async atualizar(
    idProduto: number,
    descricaoProduto: string,
    vinculoImagem: string,
    preco: number,
    estoqueMinimo: number,
    idCategoria: number,
    idFornecedor: number,
  ): Promise<Produto> {
    await this.validarRelacionamentos(idCategoria, idFornecedor);

    const produtoAtual = await this.buscarPorId(idProduto);
    const produtoAtualizado = produtoAtual.atualizar(
      descricaoProduto,
      vinculoImagem,
      preco,
      estoqueMinimo,
      idCategoria,
      idFornecedor,
    );

    return this._repository.atualizar(produtoAtualizado);
  }

  public async deletar(idProduto: number): Promise<void> {
    await this.buscarPorId(idProduto);

    try {
      await this._repository.deletar(idProduto);
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new Error(
          'Nao foi possivel remover o produto porque existem registros relacionados.',
        );
      }

      throw error;
    }
  }

  private async validarRelacionamentos(
    idCategoria: number,
    idFornecedor: number,
  ): Promise<void> {
    const categoria = await this._categoriaRepository.buscarPorId(idCategoria);

    if (!categoria) {
      throw new Error('Categoria informada nao existe.');
    }

    const fornecedor = await this._fornecedorRepository.buscarPorId(idFornecedor);

    if (!fornecedor) {
      throw new Error('Fornecedor informado nao existe.');
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
