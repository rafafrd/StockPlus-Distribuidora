import { banco, ExecutorQuery } from '../database/db.connection';
import { Estoque } from '../models/estoque.model';
import { LoteEstoque } from '../models/lote-estoque.model';
import { Movimentacao, TipoMovimentacao } from '../models/movimentacao.model';
import { EstoqueRepository } from '../repository/estoque.repository';
import { LoteEstoqueRepository } from '../repository/lote-estoque.repository';
import { MovimentacaoRepository } from '../repository/movimentacao.repository';
import { ProdutoRepository } from '../repository/produto.repository';

export class MovimentacaoService {
  private readonly _repository: MovimentacaoRepository;
  private readonly _produtoRepository: ProdutoRepository;
  private readonly _estoqueRepository: EstoqueRepository;
  private readonly _loteRepository: LoteEstoqueRepository;

  constructor() {
    this._repository = new MovimentacaoRepository();
    this._produtoRepository = new ProdutoRepository();
    this._estoqueRepository = new EstoqueRepository();
    this._loteRepository = new LoteEstoqueRepository();
  }

  public async listarTodos(): Promise<Movimentacao[]> {
    return this._repository.listarTodos();
  }

  public async buscarPorId(idMovimentacao: number): Promise<Movimentacao> {
    const movimentacao = await this._repository.buscarPorId(idMovimentacao);

    if (!movimentacao) {
      throw new Error('Movimentacao nao encontrada.');
    }

    return movimentacao;
  }

  public async criar(
    tipoMovimento: TipoMovimentacao,
    quantidade: number,
    idLote: number | null,
    idProduto: number | null,
  ): Promise<Movimentacao> {
    const conexao = await banco.getConnection();

    try {
      await conexao.beginTransaction();

      const movimentacaoBase = Movimentacao.criar(tipoMovimento, quantidade, idLote, idProduto);
      const contexto = await this.resolverRelacionamentos(
        movimentacaoBase.IdProduto,
        movimentacaoBase.IdLote,
        conexao,
      );

      const movimentacao = movimentacaoBase.definirProduto(contexto.idProduto);

      await this.aplicarDeltaNoEstoque(contexto.idProduto, movimentacao.obterDeltaQuantidade(), conexao);

      if (contexto.lote) {
        await this.aplicarDeltaNoLote(contexto.lote, movimentacao.obterDeltaQuantidade(), conexao);
      }

      const movimentacaoCriada = await this._repository.criar(movimentacao, conexao);
      await conexao.commit();
      return movimentacaoCriada;
    } catch (error) {
      await conexao.rollback();
      throw error;
    } finally {
      conexao.release();
    }
  }

  public async atualizar(
    idMovimentacao: number,
    tipoMovimento: TipoMovimentacao,
    quantidade: number,
    idLote: number | null,
    idProduto: number | null,
  ): Promise<Movimentacao> {
    const conexao = await banco.getConnection();

    try {
      await conexao.beginTransaction();

      const movimentacaoAtual = await this._repository.buscarPorId(idMovimentacao, conexao);

      if (!movimentacaoAtual) {
        throw new Error('Movimentacao nao encontrada.');
      }

      const contextoAtual = await this.resolverRelacionamentos(
        movimentacaoAtual.IdProduto,
        movimentacaoAtual.IdLote,
        conexao,
      );

      await this.aplicarDeltaNoEstoque(
        contextoAtual.idProduto,
        movimentacaoAtual.obterDeltaQuantidade() * -1,
        conexao,
      );

      if (contextoAtual.lote) {
        await this.aplicarDeltaNoLote(
          contextoAtual.lote,
          movimentacaoAtual.obterDeltaQuantidade() * -1,
          conexao,
        );
      }

      const movimentacaoNovaBase = movimentacaoAtual.atualizar(
        tipoMovimento,
        quantidade,
        idLote,
        idProduto,
      );

      const contextoNovo = await this.resolverRelacionamentos(
        movimentacaoNovaBase.IdProduto,
        movimentacaoNovaBase.IdLote,
        conexao,
      );

      const movimentacaoAtualizada = movimentacaoNovaBase.definirProduto(contextoNovo.idProduto);

      await this.aplicarDeltaNoEstoque(
        contextoNovo.idProduto,
        movimentacaoAtualizada.obterDeltaQuantidade(),
        conexao,
      );

      if (contextoNovo.lote) {
        await this.aplicarDeltaNoLote(
          contextoNovo.lote,
          movimentacaoAtualizada.obterDeltaQuantidade(),
          conexao,
        );
      }

      const movimentacaoPersistida = await this._repository.atualizar(
        movimentacaoAtualizada,
        conexao,
      );

      await conexao.commit();
      return movimentacaoPersistida;
    } catch (error) {
      await conexao.rollback();
      throw error;
    } finally {
      conexao.release();
    }
  }

  public async deletar(idMovimentacao: number): Promise<void> {
    const conexao = await banco.getConnection();

    try {
      await conexao.beginTransaction();

      const movimentacao = await this._repository.buscarPorId(idMovimentacao, conexao);

      if (!movimentacao) {
        throw new Error('Movimentacao nao encontrada.');
      }

      const contexto = await this.resolverRelacionamentos(
        movimentacao.IdProduto,
        movimentacao.IdLote,
        conexao,
      );

      await this.aplicarDeltaNoEstoque(
        contexto.idProduto,
        movimentacao.obterDeltaQuantidade() * -1,
        conexao,
      );

      if (contexto.lote) {
        await this.aplicarDeltaNoLote(
          contexto.lote,
          movimentacao.obterDeltaQuantidade() * -1,
          conexao,
        );
      }

      await this._repository.deletar(idMovimentacao, conexao);
      await conexao.commit();
    } catch (error) {
      await conexao.rollback();
      throw error;
    } finally {
      conexao.release();
    }
  }

  private async resolverRelacionamentos(
    idProduto: number | null,
    idLote: number | null,
    executor: ExecutorQuery,
  ): Promise<{ idProduto: number; lote: LoteEstoque | null }> {
    const lote = idLote === null ? null : await this._loteRepository.buscarPorId(idLote, executor);

    if (idLote !== null && !lote) {
      throw new Error('Lote de estoque nao encontrado.');
    }

    const idProdutoResolvido = idProduto ?? lote?.IdProduto ?? null;

    if (!idProdutoResolvido) {
      throw new Error('Informe um produto ou um lote valido para a movimentacao.');
    }

    const produto = await this._produtoRepository.buscarPorId(idProdutoResolvido, executor);

    if (!produto) {
      throw new Error('Produto informado nao existe.');
    }

    if (lote && lote.IdProduto !== idProdutoResolvido) {
      throw new Error('O lote informado nao pertence ao produto informado.');
    }

    return {
      idProduto: idProdutoResolvido,
      lote,
    };
  }

  private async aplicarDeltaNoEstoque(
    idProduto: number,
    delta: number,
    executor: ExecutorQuery,
  ): Promise<void> {
    const estoque = await this._estoqueRepository.buscarPorProduto(idProduto, executor);

    if (!estoque) {
      if (delta < 0) {
        throw new Error('Estoque insuficiente para registrar a saida.');
      }

      await this._estoqueRepository.criar(Estoque.criar(idProduto, delta), executor);
      return;
    }

    const estoqueAtualizado =
      delta >= 0 ? estoque.somarQuantidade(delta) : estoque.subtrairQuantidade(Math.abs(delta));

    await this._estoqueRepository.atualizar(estoqueAtualizado, executor);
  }

  private async aplicarDeltaNoLote(
    lote: LoteEstoque,
    delta: number,
    executor: ExecutorQuery,
  ): Promise<void> {
    const loteAtualizado = lote.ajustarQuantidade(delta);
    await this._loteRepository.atualizar(loteAtualizado, executor);
  }
}
