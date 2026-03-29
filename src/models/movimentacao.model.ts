import { RowDataPacket } from 'mysql2/promise';

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';

export interface IMovimentacao extends RowDataPacket {
  id_movimentacao: number;
  tipo_movimento: TipoMovimentacao;
  quantidade: number;
  dt_movimentacao: Date | string;
  id_lote: number | null;
  id_produto: number | null;
}

export class Movimentacao {
  private readonly _idMovimentacao: number | null;
  private readonly _tipoMovimento: TipoMovimentacao;
  private readonly _quantidade: number;
  private readonly _dataMovimentacao: string;
  private readonly _idLote: number | null;
  private readonly _idProduto: number | null;

  constructor(
    idMovimentacao: number | null,
    tipoMovimento: TipoMovimentacao,
    quantidade: number,
    dataMovimentacao: string,
    idLote: number | null,
    idProduto: number | null,
  ) {
    this._idMovimentacao = idMovimentacao;
    this._tipoMovimento = Movimentacao.validarTipo(tipoMovimento);
    this._quantidade = Movimentacao.validarInteiroPositivo(quantidade, 'quantidade');
    this._dataMovimentacao = Movimentacao.formatarData(dataMovimentacao);
    this._idLote = idLote === null ? null : Movimentacao.validarInteiroPositivo(idLote, 'id do lote');
    this._idProduto =
      idProduto === null ? null : Movimentacao.validarInteiroPositivo(idProduto, 'id do produto');
  }

  public get IdMovimentacao(): number | null {
    return this._idMovimentacao;
  }

  public get TipoMovimento(): TipoMovimentacao {
    return this._tipoMovimento;
  }

  public get Quantidade(): number {
    return this._quantidade;
  }

  public get DataMovimentacao(): string {
    return this._dataMovimentacao;
  }

  public get IdLote(): number | null {
    return this._idLote;
  }

  public get IdProduto(): number | null {
    return this._idProduto;
  }

  public static criar(
    tipoMovimento: TipoMovimentacao,
    quantidade: number,
    idLote: number | null,
    idProduto: number | null,
  ): Movimentacao {
    return new Movimentacao(
      null,
      tipoMovimento,
      quantidade,
      new Date().toISOString(),
      idLote,
      idProduto,
    );
  }

  public static fromDB(row: IMovimentacao): Movimentacao {
    return new Movimentacao(
      row.id_movimentacao,
      row.tipo_movimento,
      row.quantidade,
      Movimentacao.converterData(row.dt_movimentacao),
      row.id_lote,
      row.id_produto,
    );
  }

  public atualizar(
    tipoMovimento: TipoMovimentacao,
    quantidade: number,
    idLote: number | null,
    idProduto: number | null,
  ): Movimentacao {
    return new Movimentacao(
      this._idMovimentacao,
      tipoMovimento,
      quantidade,
      new Date().toISOString(),
      idLote,
      idProduto,
    );
  }

  public definirProduto(idProduto: number): Movimentacao {
    return new Movimentacao(
      this._idMovimentacao,
      this._tipoMovimento,
      this._quantidade,
      this._dataMovimentacao,
      this._idLote,
      idProduto,
    );
  }

  public ehEntrada(): boolean {
    return this._tipoMovimento === 'ENTRADA';
  }

  public obterDeltaQuantidade(): number {
    return this.ehEntrada() ? this._quantidade : this._quantidade * -1;
  }

  private static converterData(data: Date | string): string {
    return data instanceof Date ? data.toISOString() : data;
  }

  private static formatarData(data: string): string {
    if (data.trim().length === 0) {
      throw new Error('A data da movimentacao e obrigatoria.');
    }

    return data;
  }

  private static validarTipo(tipo: TipoMovimentacao): TipoMovimentacao {
    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
      throw new Error('O tipo de movimentacao deve ser ENTRADA ou SAIDA.');
    }

    return tipo;
  }

  private static validarInteiroPositivo(valor: number, campo: string): number {
    if (!Number.isInteger(valor) || valor <= 0) {
      throw new Error(`O campo ${campo} deve ser um inteiro positivo.`);
    }

    return valor;
  }
}
