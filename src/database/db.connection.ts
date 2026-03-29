import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { EnvVar } from '../config/EnvVar';

class Database {
  private static _instance: Database | null = null;
  private readonly _pool: Pool;

  private constructor() {
    this._pool = mysql.createPool({
      host: EnvVar.DB_HOST,
      port: EnvVar.DB_PORT,
      user: EnvVar.DB_USER,
      password: EnvVar.DB_PASSWORD,
      database: EnvVar.DB_NAME,
      waitForConnections: true,
      connectionLimit: EnvVar.DB_CONNECTION_LIMIT,
      queueLimit: 0,
      decimalNumbers: true,
    });
  }

  public static getInstance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }

    return Database._instance;
  }

  public get Pool(): Pool {
    return this._pool;
  }

  public async getConnection(): Promise<PoolConnection> {
    return this._pool.getConnection();
  }

  public async testarConexao(): Promise<void> {
    const conexao = await this.getConnection();
    conexao.release();
  }
}

export const banco = Database.getInstance();
export const db = banco.Pool;
export type ExecutorQuery = Pool | PoolConnection;
