import { RowDataPacket } from 'mysql2/promise';

export interface IEstoque extends RowDataPacket {
  id_estoque: number;
  id_produto: number;
  quantidade_atual: number;
  dt_ultima_atualizacao: Date | string;
}

export class Estoque {
  private readonly _idEstoque: number | null;
  private readonly _idProduto: number;
  private readonly _quantidadeAtual: number;
  private readonly _dataUltimaAtualizacao: string;

  constructor(
    idEstoque: number | null,
    idProduto: number,
    quantidadeAtual: number,
    dataUltimaAtualizacao: string,
  ) {
    this._idEstoque = idEstoque;
    this._idProduto = Estoque.validarInteiroPositivo(idProduto, 'id do produto');
    this._quantidadeAtual = Estoque.validarInteiroNaoNegativo(
      quantidadeAtual,
      'quantidade atual',
    );
    this._dataUltimaAtualizacao = Estoque.formatarData(dataUltimaAtualizacao);
  }

  public get IdEstoque(): number | null {
    return this._idEstoque;
  }

  public get IdProduto(): number {
    return this._idProduto;
  }

  public get QuantidadeAtual(): number {
    return this._quantidadeAtual;
  }

  public get DataUltimaAtualizacao(): string {
    return this._dataUltimaAtualizacao;
  }

  public static criar(idProduto: number, quantidadeAtual: number): Estoque {
    return new Estoque(null, idProduto, quantidadeAtual, new Date().toISOString());
  }

  public static fromDB(row: IEstoque): Estoque {
    return new Estoque(
      row.id_estoque,
      row.id_produto,
      row.quantidade_atual,
      Estoque.converterData(row.dt_ultima_atualizacao),
    );
  }

  public atualizar(idProduto: number, quantidadeAtual: number): Estoque {
    return new Estoque(this._idEstoque, idProduto, quantidadeAtual, new Date().toISOString());
  }

  public somarQuantidade(quantidade: number): Estoque {
    const valor = Estoque.validarInteiroPositivo(quantidade, 'quantidade');
    return new Estoque(
      this._idEstoque,
      this._idProduto,
      this._quantidadeAtual + valor,
      new Date().toISOString(),
    );
  }

  public subtrairQuantidade(quantidade: number): Estoque {
    const valor = Estoque.validarInteiroPositivo(quantidade, 'quantidade');

    if (this._quantidadeAtual - valor < 0) {
      throw new Error('A quantidade em estoque nao pode ficar negativa.');
    }

    return new Estoque(
      this._idEstoque,
      this._idProduto,
      this._quantidadeAtual - valor,
      new Date().toISOString(),
    );
  }

  private static formatarData(data: string): string {
    if (data.trim().length === 0) {
      throw new Error('A data da ultima atualizacao e obrigatoria.');
    }

    return data;
  }

  private static converterData(data: Date | string): string {
    return data instanceof Date ? data.toISOString() : data;
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
