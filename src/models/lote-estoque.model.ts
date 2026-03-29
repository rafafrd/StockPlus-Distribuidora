import { RowDataPacket } from 'mysql2/promise';

export interface ILoteEstoque extends RowDataPacket {
  id_lote: number;
  id_produto: number;
  dt_vencimento: Date | string | null;
  quantidade_lote: number | null;
  dt_entrada: Date | string;
}

export class LoteEstoque {
  private readonly _idLote: number | null;
  private readonly _idProduto: number;
  private readonly _dataVencimento: string | null;
  private readonly _quantidadeLote: number;
  private readonly _dataEntrada: string;

  constructor(
    idLote: number | null,
    idProduto: number,
    dataVencimento: string | null,
    quantidadeLote: number,
    dataEntrada: string,
  ) {
    this._idLote = idLote;
    this._idProduto = LoteEstoque.validarInteiroPositivo(idProduto, 'id do produto');
    this._dataVencimento = LoteEstoque.formatarDataOpcional(dataVencimento);
    this._quantidadeLote = LoteEstoque.validarInteiroNaoNegativo(
      quantidadeLote,
      'quantidade do lote',
    );
    this._dataEntrada = LoteEstoque.formatarDataObrigatoria(dataEntrada);
  }

  public get IdLote(): number | null {
    return this._idLote;
  }

  public get IdProduto(): number {
    return this._idProduto;
  }

  public get DataVencimento(): string | null {
    return this._dataVencimento;
  }

  public get QuantidadeLote(): number {
    return this._quantidadeLote;
  }

  public get DataEntrada(): string {
    return this._dataEntrada;
  }

  public static criar(
    idProduto: number,
    dataVencimento: string | null,
    quantidadeLote: number | null,
  ): LoteEstoque {
    return new LoteEstoque(
      null,
      idProduto,
      dataVencimento,
      quantidadeLote ?? 0,
      new Date().toISOString(),
    );
  }

  public static fromDB(row: ILoteEstoque): LoteEstoque {
    return new LoteEstoque(
      row.id_lote,
      row.id_produto,
      row.dt_vencimento === null ? null : LoteEstoque.converterData(row.dt_vencimento),
      row.quantidade_lote ?? 0,
      LoteEstoque.converterData(row.dt_entrada),
    );
  }

  public atualizar(
    idProduto: number,
    dataVencimento: string | null,
    quantidadeLote: number,
  ): LoteEstoque {
    return new LoteEstoque(
      this._idLote,
      idProduto,
      dataVencimento,
      quantidadeLote,
      this._dataEntrada,
    );
  }

  public ajustarQuantidade(delta: number): LoteEstoque {
    if (!Number.isInteger(delta)) {
      throw new Error('A alteracao da quantidade do lote precisa ser um numero inteiro.');
    }

    const novaQuantidade = this._quantidadeLote + delta;

    if (novaQuantidade < 0) {
      throw new Error('A quantidade do lote nao pode ficar negativa.');
    }

    return new LoteEstoque(
      this._idLote,
      this._idProduto,
      this._dataVencimento,
      novaQuantidade,
      this._dataEntrada,
    );
  }

  public estaVencido(): boolean {
    if (!this._dataVencimento) {
      return false;
    }

    return new Date(this._dataVencimento).getTime() < Date.now();
  }

  private static converterData(data: Date | string): string {
    return data instanceof Date ? data.toISOString() : data;
  }

  private static formatarDataObrigatoria(data: string): string {
    if (data.trim().length === 0) {
      throw new Error('A data de entrada e obrigatoria.');
    }

    return data;
  }

  private static formatarDataOpcional(data: string | null): string | null {
    if (data === null) {
      return null;
    }

    const texto = data.trim();
    return texto.length === 0 ? null : texto;
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
