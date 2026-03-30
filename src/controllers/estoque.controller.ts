import { Request, Response } from 'express';
import { EstoqueService } from '../services/estoque.service';

export class EstoqueController {
  private readonly _service: EstoqueService;

  constructor() {
    this._service = new EstoqueService();
  }
// lista todos os estoques
  public listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const estoques = await this._service.listarTodos();
      res.status(200).json({
        mensagem: 'Estoques listados com sucesso.',
        recurso: estoques,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idEstoque = this.obterIdNumerico(req.params.id);

      if (idEstoque === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      const estoque = await this._service.buscarPorId(idEstoque);
      res.status(200).json({
        mensagem: 'Estoque encontrado com sucesso.',
        recurso: estoque,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idProduto = Number(req.body.id_produto);
      const quantidadeAtual = Number(req.body.quantidade_atual);
      const erros = this.validarEstoque(idProduto, quantidadeAtual);

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const estoque = await this._service.criar(idProduto, quantidadeAtual);
      res.status(201).json({
        mensagem: 'Estoque criado com sucesso.',
        recurso: estoque,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idEstoque = this.obterIdNumerico(req.params.id);
      const idProduto = Number(req.body.id_produto);
      const quantidadeAtual = Number(req.body.quantidade_atual);
      const erros = this.validarEstoque(idProduto, quantidadeAtual);

      if (idEstoque === null) {
        erros.push({ campo: 'id', mensagem: 'Informe um id valido.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const estoque = await this._service.atualizar(
        idEstoque as number,
        idProduto,
        quantidadeAtual,
      );
      res.status(200).json({
        mensagem: 'Estoque atualizado com sucesso.',
        recurso: estoque,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idEstoque = this.obterIdNumerico(req.params.id);

      if (idEstoque === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      await this._service.deletar(idEstoque);
      res.status(200).json({ mensagem: 'Estoque deletado com sucesso.' });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  private validarEstoque(
    idProduto: number,
    quantidadeAtual: number,
  ): Array<{ campo: string; mensagem: string }> {
    const erros: Array<{ campo: string; mensagem: string }> = [];

    if (!Number.isInteger(idProduto) || idProduto <= 0) {
      erros.push({ campo: 'id_produto', mensagem: 'O campo id_produto deve ser um inteiro positivo.' });
    }

    if (!Number.isInteger(quantidadeAtual) || quantidadeAtual < 0) {
      erros.push({
        campo: 'quantidade_atual',
        mensagem: 'O campo quantidade_atual deve ser um inteiro nao negativo.',
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

    if (mensagem.includes('Ja existe')) {
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
