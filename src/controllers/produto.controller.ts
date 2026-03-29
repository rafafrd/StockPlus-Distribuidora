import { Request, Response } from 'express';
import { ProdutoService } from '../services/produto.service';

export class ProdutoController {
  private readonly _service: ProdutoService;

  constructor() {
    this._service = new ProdutoService();
  }

  public listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const produtos = await this._service.listarTodos();
      res.status(200).json({
        mensagem: 'Produtos listados com sucesso.',
        recurso: produtos,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idProduto = this.obterIdNumerico(req.params.id);

      if (idProduto === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      const produto = await this._service.buscarPorId(idProduto);
      res.status(200).json({
        mensagem: 'Produto encontrado com sucesso.',
        recurso: produto,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const descricaoProduto =
        typeof req.body.dc_produto === 'string' ? req.body.dc_produto : '';
      const vinculoImagem =
        typeof req.body.vinculo_imagem === 'string' ? req.body.vinculo_imagem : '';
      const preco = Number(req.body.preco);
      const estoqueMinimo = Number(req.body.estoque_minimo);
      const idCategoria = Number(req.body.id_categoria);
      const idFornecedor = Number(req.body.id_fornecedor);
      const erros = this.validarProduto(
        descricaoProduto,
        vinculoImagem,
        preco,
        estoqueMinimo,
        idCategoria,
        idFornecedor,
      );

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const produto = await this._service.criar(
        descricaoProduto,
        vinculoImagem,
        preco,
        estoqueMinimo,
        idCategoria,
        idFornecedor,
      );

      res.status(201).json({
        mensagem: 'Produto criado com sucesso.',
        recurso: produto,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idProduto = this.obterIdNumerico(req.params.id);
      const descricaoProduto =
        typeof req.body.dc_produto === 'string' ? req.body.dc_produto : '';
      const vinculoImagem =
        typeof req.body.vinculo_imagem === 'string' ? req.body.vinculo_imagem : '';
      const preco = Number(req.body.preco);
      const estoqueMinimo = Number(req.body.estoque_minimo);
      const idCategoria = Number(req.body.id_categoria);
      const idFornecedor = Number(req.body.id_fornecedor);
      const erros = this.validarProduto(
        descricaoProduto,
        vinculoImagem,
        preco,
        estoqueMinimo,
        idCategoria,
        idFornecedor,
      );

      if (idProduto === null) {
        erros.push({ campo: 'id', mensagem: 'Informe um id valido.' });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: 'Dados invalidos.', erros });
        return;
      }

      const produto = await this._service.atualizar(
        idProduto as number,
        descricaoProduto,
        vinculoImagem,
        preco,
        estoqueMinimo,
        idCategoria,
        idFornecedor,
      );

      res.status(200).json({
        mensagem: 'Produto atualizado com sucesso.',
        recurso: produto,
      });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  public deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const idProduto = this.obterIdNumerico(req.params.id);

      if (idProduto === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      await this._service.deletar(idProduto);
      res.status(200).json({ mensagem: 'Produto deletado com sucesso.' });
    } catch (error) {
      this.responderErro(res, error);
    }
  };

  private validarProduto(
    descricaoProduto: string,
    vinculoImagem: string,
    preco: number,
    estoqueMinimo: number,
    idCategoria: number,
    idFornecedor: number,
  ): Array<{ campo: string; mensagem: string }> {
    const erros: Array<{ campo: string; mensagem: string }> = [];

    if (descricaoProduto.trim().length === 0) {
      erros.push({ campo: 'dc_produto', mensagem: 'O campo dc_produto e obrigatorio.' });
    }

    if (vinculoImagem.trim().length === 0) {
      erros.push({
        campo: 'vinculo_imagem',
        mensagem: 'O campo vinculo_imagem e obrigatorio.',
      });
    }

    if (!Number.isFinite(preco) || preco < 0) {
      erros.push({ campo: 'preco', mensagem: 'O campo preco deve ser um numero nao negativo.' });
    }

    if (!Number.isInteger(estoqueMinimo) || estoqueMinimo < 0) {
      erros.push({
        campo: 'estoque_minimo',
        mensagem: 'O campo estoque_minimo deve ser um inteiro nao negativo.',
      });
    }

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
      erros.push({
        campo: 'id_categoria',
        mensagem: 'O campo id_categoria deve ser um inteiro positivo.',
      });
    }

    if (!Number.isInteger(idFornecedor) || idFornecedor <= 0) {
      erros.push({
        campo: 'id_fornecedor',
        mensagem: 'O campo id_fornecedor deve ser um inteiro positivo.',
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

    if (mensagem.includes('Nao foi possivel remover') || mensagem.includes('Ja existe') || mensagem.includes('relacionados')) {
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
