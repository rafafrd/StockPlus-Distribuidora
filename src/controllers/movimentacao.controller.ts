import { Request, Response } from 'express';
import { MovimentacaoService } from '../services/movimentacao.service';
import { TipoMovimentacao } from '../models/movimentacao.model';

export class MovimentacaoController {
  private readonly _service: MovimentacaoService;

  constructor() {
    this._service = new MovimentacaoService();
  }

  public listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const movimentacoes = await this._service.listarTodos();
      res.status(200).json({
        mensagem: 'Movimentacoes listadas com sucesso.',
        recurso: movimentacoes,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idMovimentacao = this.obterIdNumerico(req.params.id);

      if (idMovimentacao === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      const movimentacao = await this._service.buscarPorId(idMovimentacao);
      res.status(200).json({
        mensagem: 'Movimentacao encontrada com sucesso.',
        recurso: movimentacao,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const tipoMovimento = req.body.tipo_movimento as TipoMovimentacao;
      const quantidade = Number(req.body.quantidade);
      const idLote =
        req.body.id_lote === null || req.body.id_lote === undefined
          ? null
          : Number(req.body.id_lote);
      const idProduto =
        req.body.id_produto === null || req.body.id_produto === undefined
          ? null
          : Number(req.body.id_produto);
      const erros = this.validarMovimentacao(tipoMovimento, quantidade, idLote, idProduto);

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const movimentacao = await this._service.criar(tipoMovimento, quantidade, idLote, idProduto);
      res.status(201).json({
        mensagem: 'Movimentacao criada com sucesso.',
        recurso: movimentacao,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idMovimentacao = this.obterIdNumerico(req.params.id);
      const tipoMovimento = req.body.tipo_movimento as TipoMovimentacao;
      const quantidade = Number(req.body.quantidade);
      const idLote =
        req.body.id_lote === null || req.body.id_lote === undefined
          ? null
          : Number(req.body.id_lote);
      const idProduto =
        req.body.id_produto === null || req.body.id_produto === undefined
          ? null
          : Number(req.body.id_produto);
      const erros = this.validarMovimentacao(tipoMovimento, quantidade, idLote, idProduto);

      if (idMovimentacao === null) {
        erros.push({ campo: 'id', mensagem: 'Informe um id valido.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const movimentacao = await this._service.atualizar(
        idMovimentacao as number,
        tipoMovimento,
        quantidade,
        idLote,
        idProduto,
      );

      res.status(200).json({
        mensagem: 'Movimentacao atualizada com sucesso.',
        recurso: movimentacao,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idMovimentacao = this.obterIdNumerico(req.params.id);

      if (idMovimentacao === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      await this._service.deletar(idMovimentacao);
      res.status(200).json({ mensagem: 'Movimentacao deletada com sucesso.' });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  private validarMovimentacao(
    tipoMovimento: TipoMovimentacao,
    quantidade: number,
    idLote: number | null,
    idProduto: number | null,
  ): Array<{ campo: string; mensagem: string }> {
    const erros: Array<{ campo: string; mensagem: string }> = [];

    if (tipoMovimento !== 'ENTRADA' && tipoMovimento !== 'SAIDA') {
      erros.push({
        campo: 'tipo_movimento',
        mensagem: 'O campo tipo_movimento deve ser ENTRADA ou SAIDA.',
      });
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      erros.push({
        campo: 'quantidade',
        mensagem: 'O campo quantidade deve ser um inteiro positivo.',
      });
    }

    if (idProduto === null && idLote === null) {
      erros.push({
        campo: 'movimentacao',
        mensagem: 'Informe ao menos id_produto ou id_lote.',
      });
    }

    if (idProduto !== null && (!Number.isInteger(idProduto) || idProduto <= 0)) {
      erros.push({
        campo: 'id_produto',
        mensagem: 'O campo id_produto deve ser um inteiro positivo.',
      });
    }

    if (idLote !== null && (!Number.isInteger(idLote) || idLote <= 0)) {
      erros.push({
        campo: 'id_lote',
        mensagem: 'O campo id_lote deve ser um inteiro positivo.',
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
      mensagem.includes('nao pode') ||
      mensagem.includes('insuficiente') ||
      mensagem.includes('Informe')
    ) {
      return 400;
    }

    return 500;
  }
}
