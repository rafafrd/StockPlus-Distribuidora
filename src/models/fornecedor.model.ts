import { RowDataPacket } from 'mysql2/promise';

export interface IFornecedor extends RowDataPacket {
  id_fornecedor: number;
  dc_fornecedor: string | null;
}

export class Fornecedor {
  private readonly _idFornecedor: number | null;
  private readonly _descricaoFornecedor: string;

  constructor(idFornecedor: number | null, descricaoFornecedor: string) {
    this._idFornecedor = idFornecedor;
    this._descricaoFornecedor = Fornecedor.validarDescricao(descricaoFornecedor);
  }

  public get IdFornecedor(): number | null {
    return this._idFornecedor;
  }

  public get DescricaoFornecedor(): string {
    return this._descricaoFornecedor;
  }

  public static criar(descricaoFornecedor: string): Fornecedor {
    return new Fornecedor(null, descricaoFornecedor);
  }

  public static fromDB(row: IFornecedor): Fornecedor {
    return new Fornecedor(row.id_fornecedor, row.dc_fornecedor ?? '');
  }

  public atualizar(descricaoFornecedor: string): Fornecedor {
    return new Fornecedor(this._idFornecedor, descricaoFornecedor);
  }

  private static validarDescricao(descricaoFornecedor: string): string {
    const descricao = descricaoFornecedor.trim();

    if (descricao.length === 0) {
      throw new Error('A descricao do fornecedor e obrigatoria.');
    }

    return descricao;
  }
}
