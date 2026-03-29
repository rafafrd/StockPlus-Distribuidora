import 'dotenv/config';
import { EnvKey } from './enum/EnvKey';

export class EnvVar {
  private constructor() {}

  public static getTexto(chave: EnvKey, valorPadrao?: string): string {
    const valor = process.env[chave];

    if (valor === undefined || valor.trim() === '') {
      if (valorPadrao !== undefined) {
        return valorPadrao;
      }

      throw new Error(`A variavel de ambiente ${chave} nao foi informada.`);
    }

    return valor;
  }

  public static getNumero(chave: EnvKey, valorPadrao?: number): number {
    const valor = process.env[chave];

    if (valor === undefined || valor.trim() === '') {
      if (valorPadrao !== undefined) {
        return valorPadrao;
      }

      throw new Error(`A variavel de ambiente ${chave} nao foi informada.`);
    }

    const numero = Number(valor);

    if (Number.isNaN(numero)) {
      throw new Error(`A variavel de ambiente ${chave} precisa ser numerica.`);
    }

    return numero;
  }

  public static get PORT(): number {
    return this.getNumero(EnvKey.PORT, 3000);
  }

  public static get DB_HOST(): string {
    return this.getTexto(EnvKey.DB_HOST);
  }

  public static get DB_PORT(): number {
    return this.getNumero(EnvKey.DB_PORT, 3306);
  }

  public static get DB_USER(): string {
    return this.getTexto(EnvKey.DB_USER);
  }

  public static get DB_PASSWORD(): string {
    return this.getTexto(EnvKey.DB_PASSWORD);
  }

  public static get DB_NAME(): string {
    return this.getTexto(EnvKey.DB_NAME);
  }

  public static get DB_CONNECTION_LIMIT(): number {
    return this.getNumero(EnvKey.DB_CONNECTION_LIMIT, 10);
  }
}
