import { RowDataPacket } from 'mysql2/promise';

export interface ICategoria extends RowDataPacket {
  id_categoria: number;
  dc_categoria: string | null;
}

export class Categoria {
  private readonly _idCategoria: number | null;
  private readonly _descricaoCategoria: string;

  constructor(idCategoria: number | null, descricaoCategoria: string) {
    this._idCategoria = idCategoria;
    this._descricaoCategoria = Categoria.validarDescricao(descricaoCategoria);
  }

  public get IdCategoria(): number | null {
    return this._idCategoria;
  }

  public get DescricaoCategoria(): string {
    return this._descricaoCategoria;
  }

  public static criar(descricaoCategoria: string): Categoria {
    return new Categoria(null, descricaoCategoria);
  }

  public static fromDB(row: ICategoria): Categoria {
    return new Categoria(row.id_categoria, row.dc_categoria ?? '');
  }

  public atualizar(descricaoCategoria: string): Categoria {
    return new Categoria(this._idCategoria, descricaoCategoria);
  }

  private static validarDescricao(descricaoCategoria: string): string {
    const descricao = descricaoCategoria.trim();

    if (descricao.length === 0) {
      throw new Error('A descricao da categoria e obrigatoria.');
    }

    return descricao;
  }
}
