import { RowDataPacket } from 'mysql2/promise';

export interface IProduto extends RowDataPacket {
  id_produto: number;
  dc_produto: string | null;
  vinculo_imagem: string;
  preco: number;
  estoque_minimo: number;
  id_categoria: number;
  id_fornecedor: number;
}

export class Produto {
  private readonly _idProduto: number | null;
  private readonly _descricaoProduto: string;
  private readonly _vinculoImagem: string;
  private readonly _preco: number;
  private readonly _estoqueMinimo: number;
  private readonly _idCategoria: number;
  private readonly _idFornecedor: number;

  constructor(
    idProduto: number | null,
    descricaoProduto: string,
    vinculoImagem: string,
    preco: number,
    estoqueMinimo: number,
    idCategoria: number,
    idFornecedor: number,
  ) {
    this._idProduto = idProduto;
    this._descricaoProduto = Produto.validarTextoObrigatorio(descricaoProduto, 'descricao do produto');
    this._vinculoImagem = Produto.validarTextoObrigatorio(vinculoImagem, 'vinculo da imagem');
    this._preco = Produto.validarNumeroNaoNegativo(preco, 'preco');
    this._estoqueMinimo = Produto.validarInteiroNaoNegativo(estoqueMinimo, 'estoque minimo');
    this._idCategoria = Produto.validarInteiroPositivo(idCategoria, 'id da categoria');
    this._idFornecedor = Produto.validarInteiroPositivo(idFornecedor, 'id do fornecedor');
  }

  public get IdProduto(): number | null {
    return this._idProduto;
  }

  public get DescricaoProduto(): string {
    return this._descricaoProduto;
  }

  public get VinculoImagem(): string {
    return this._vinculoImagem;
  }

  public get Preco(): number {
    return this._preco;
  }

  public get EstoqueMinimo(): number {
    return this._estoqueMinimo;
  }

  public get IdCategoria(): number {
    return this._idCategoria;
  }

  public get IdFornecedor(): number {
    return this._idFornecedor;
  }

  public static criar(
    descricaoProduto: string,
    vinculoImagem: string,
    preco: number,
    estoqueMinimo: number,
    idCategoria: number,
    idFornecedor: number,
  ): Produto {
    return new Produto(
      null,
      descricaoProduto,
      vinculoImagem,
      preco,
      estoqueMinimo,
      idCategoria,
      idFornecedor,
    );
  }

  public static fromDB(row: IProduto): Produto {
    return new Produto(
      row.id_produto,
      row.dc_produto ?? '',
      row.vinculo_imagem,
      Number(row.preco),
      row.estoque_minimo,
      row.id_categoria,
      row.id_fornecedor,
    );
  }

  public atualizar(
    descricaoProduto: string,
    vinculoImagem: string,
    preco: number,
    estoqueMinimo: number,
    idCategoria: number,
    idFornecedor: number,
  ): Produto {
    return new Produto(
      this._idProduto,
      descricaoProduto,
      vinculoImagem,
      preco,
      estoqueMinimo,
      idCategoria,
      idFornecedor,
    );
  }

  public estaAbaixoDoEstoqueMinimo(quantidadeAtual: number): boolean {
    return quantidadeAtual <= this._estoqueMinimo;
  }

  private static validarTextoObrigatorio(valor: string, campo: string): string {
    const texto = valor.trim();

    if (texto.length === 0) {
      throw new Error(`A ${campo} e obrigatoria.`);
    }

    return texto;
  }

  private static validarNumeroNaoNegativo(valor: number, campo: string): number {
    if (!Number.isFinite(valor) || valor < 0) {
      throw new Error(`O campo ${campo} deve ser um numero nao negativo.`);
    }

    return valor;
  }

  private static validarInteiroNaoNegativo(valor: number, campo: string): number {
    if (!Number.isInteger(valor) || valor < 0) {
      throw new Error(`O campo ${campo} deve ser um inteiro nao negativo.`);
    }

    return valor;
  }

  private static validarInteiroPositivo(valor: number, campo: string): number {
    if (!Number.isInteger(valor) || valor <= 0) {
      throw new Error(`O campo ${campo} deve ser um inteiro positivo.`);
    }

    return valor;
  }
}
