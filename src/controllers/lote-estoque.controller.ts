import { Request, Response } from 'express';
import { LoteEstoqueService } from '../services/lote-estoque.service';

export class LoteEstoqueController {
  private readonly _service: LoteEstoqueService;

  constructor() {
    this._service = new LoteEstoqueService();
  }

  public listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const lotes = await this._service.listarTodos();
      res.status(200).json({
        mensagem: 'Lotes listados com sucesso.',
        recurso: lotes,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idLote = this.obterIdNumerico(req.params.id);

      if (idLote === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      const lote = await this._service.buscarPorId(idLote);
      res.status(200).json({
        mensagem: 'Lote encontrado com sucesso.',
        recurso: lote,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idProduto = Number(req.body.id_produto);
      const dataVencimento =
        req.body.dt_vencimento === null || req.body.dt_vencimento === undefined
          ? null
          : String(req.body.dt_vencimento);
      const quantidadeLote =
        req.body.quantidade_lote === null || req.body.quantidade_lote === undefined
          ? null
          : Number(req.body.quantidade_lote);
      const erros = this.validarLote(idProduto, dataVencimento, quantidadeLote);

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const lote = await this._service.criar(idProduto, dataVencimento, quantidadeLote);
      res.status(201).json({
        mensagem: 'Lote criado com sucesso.',
        recurso: lote,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idLote = this.obterIdNumerico(req.params.id);
      const idProduto = Number(req.body.id_produto);
      const dataVencimento =
        req.body.dt_vencimento === null || req.body.dt_vencimento === undefined
          ? null
          : String(req.body.dt_vencimento);
      const quantidadeLote = Number(req.body.quantidade_lote);
      const erros = this.validarLote(idProduto, dataVencimento, quantidadeLote);

      if (idLote === null) {
        erros.push({ campo: 'id', mensagem: 'Informe um id valido.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const lote = await this._service.atualizar(
        idLote as number,
        idProduto,
        dataVencimento,
        quantidadeLote,
      );

      res.status(200).json({
        mensagem: 'Lote atualizado com sucesso.',
        recurso: lote,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idLote = this.obterIdNumerico(req.params.id);

      if (idLote === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      await this._service.deletar(idLote);
      res.status(200).json({ mensagem: 'Lote deletado com sucesso.' });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  private validarLote(
    idProduto: number,
    dataVencimento: string | null,
    quantidadeLote: number | null,
  ): Array<{ campo: string; mensagem: string }> {
    const erros: Array<{ campo: string; mensagem: string }> = [];

    if (!Number.isInteger(idProduto) || idProduto <= 0) {
      erros.push({ campo: 'id_produto', mensagem: 'O campo id_produto deve ser um inteiro positivo.' });
    }

    if (quantidadeLote !== null && (!Number.isInteger(quantidadeLote) || quantidadeLote < 0)) {
      erros.push({
        campo: 'quantidade_lote',
        mensagem: 'O campo quantidade_lote deve ser um inteiro nao negativo.',
      });
    }

    if (dataVencimento !== null && Number.isNaN(new Date(dataVencimento).getTime())) {
      erros.push({
        campo: 'dt_vencimento',
        mensagem: 'O campo dt_vencimento deve conter uma data valida.',
      });
    }

    return erros;
  }

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
