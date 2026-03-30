import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';

export class CategoriaController {
  private readonly _service: CategoriaService;

  constructor() {
    this._service = new CategoriaService();
  }
// lista todos as categorias
  public listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this._service.listarTodos();
      res.status(200).json({
        mensagem: 'Categorias listadas com sucesso.',
        recurso: categorias,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idCategoria = this.obterIdNumerico(req.params.id);

      if (idCategoria === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      const categoria = await this._service.buscarPorId(idCategoria);
      res.status(200).json({
        mensagem: 'Categoria encontrada com sucesso.',
        recurso: categoria,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const descricaoCategoria = typeof req.body.dc_categoria === 'string' ? req.body.dc_categoria : '';
      const erros: Array<{ campo: string; mensagem: string }> = [];

      if (descricaoCategoria.trim().length === 0) {
        erros.push({ campo: 'dc_categoria', mensagem: 'O campo dc_categoria e obrigatorio.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const categoria = await this._service.criar(descricaoCategoria);
      res.status(201).json({
        mensagem: 'Categoria criada com sucesso.',
        recurso: categoria,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idCategoria = this.obterIdNumerico(req.params.id);
      const descricaoCategoria = typeof req.body.dc_categoria === 'string' ? req.body.dc_categoria : '';
      const erros: Array<{ campo: string; mensagem: string }> = [];

      if (idCategoria === null) {
        erros.push({ campo: 'id', mensagem: 'Informe um id valido.' });
      }

      if (descricaoCategoria.trim().length === 0) {
        erros.push({ campo: 'dc_categoria', mensagem: 'O campo dc_categoria e obrigatorio.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const categoria = await this._service.atualizar(idCategoria as number, descricaoCategoria);
      res.status(200).json({
        mensagem: 'Categoria atualizada com sucesso.',
        recurso: categoria,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idCategoria = this.obterIdNumerico(req.params.id);

      if (idCategoria === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      await this._service.deletar(idCategoria);
      res.status(200).json({ mensagem: 'Categoria deletada com sucesso.' });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  private obterIdNumerico(id: string | string[] | undefined): number | null {
    if (!id || Array.isArray(id)) {
      return null;
    }

    const numero = Number(id);

    if (!Number.isInteger(numero) || numero <= 0) {
      return null;
    }

    return numero;
  }

  private responderErro(res: Response, error: unknown): void {
    const mensagem = error instanceof Error ? error.message : 'Erro interno do servidor.';
    const statusCode = this.obterStatusCode(mensagem);

    res.status(statusCode).json({ mensagem });
  }

  private obterStatusCode(mensagem: string): number {
    if (mensagem.includes('nao encontrada') || mensagem.includes('nao encontrado') || mensagem.includes('nao existe')) {
      return 404;
    }

    if (mensagem.includes('Nao foi possivel remover') || mensagem.includes('Ja existe')) {
      return 409;
    }

    if (
      mensagem.includes('obrigatoria') ||
      mensagem.includes('obrigatorio') ||
      mensagem.includes('invalido') ||
      mensagem.includes('nao pode')
    ) {
      return 400;
    }

    return 500;
  }
}
