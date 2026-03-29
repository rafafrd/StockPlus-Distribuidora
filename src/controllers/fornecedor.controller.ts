import { Request, Response } from 'express';
import { FornecedorService } from '../services/fornecedor.service';

export class FornecedorController {
  private readonly _service: FornecedorService;

  constructor() {
    this._service = new FornecedorService();
  }

  public listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const fornecedores = await this._service.listarTodos();
      res.status(200).json({
        mensagem: 'Fornecedores listados com sucesso.',
        recurso: fornecedores,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idFornecedor = this.obterIdNumerico(req.params.id);

      if (idFornecedor === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      const fornecedor = await this._service.buscarPorId(idFornecedor);
      res.status(200).json({
        mensagem: 'Fornecedor encontrado com sucesso.',
        recurso: fornecedor,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const descricaoFornecedor =
        typeof req.body.dc_fornecedor === 'string' ? req.body.dc_fornecedor : '';
      const erros: Array<{ campo: string; mensagem: string }> = [];

      if (descricaoFornecedor.trim().length === 0) {
        erros.push({ campo: 'dc_fornecedor', mensagem: 'O campo dc_fornecedor e obrigatorio.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const fornecedor = await this._service.criar(descricaoFornecedor);
      res.status(201).json({
        mensagem: 'Fornecedor criado com sucesso.',
        recurso: fornecedor,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idFornecedor = this.obterIdNumerico(req.params.id);
      const descricaoFornecedor =
        typeof req.body.dc_fornecedor === 'string' ? req.body.dc_fornecedor : '';
      const erros: Array<{ campo: string; mensagem: string }> = [];

      if (idFornecedor === null) {
        erros.push({ campo: 'id', mensagem: 'Informe um id valido.' });
      }

      if (descricaoFornecedor.trim().length === 0) {
        erros.push({ campo: 'dc_fornecedor', mensagem: 'O campo dc_fornecedor e obrigatorio.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const fornecedor = await this._service.atualizar(
        idFornecedor as number,
        descricaoFornecedor,
      );
      res.status(200).json({
        mensagem: 'Fornecedor atualizado com sucesso.',
        recurso: fornecedor,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idFornecedor = this.obterIdNumerico(req.params.id);

      if (idFornecedor === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      await this._service.deletar(idFornecedor);
      res.status(200).json({ mensagem: 'Fornecedor deletado com sucesso.' });
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
