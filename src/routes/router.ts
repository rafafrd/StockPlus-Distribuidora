import { Router } from 'express';
import { categoriaRouter } from './categoria.routes';
import { estoqueRouter } from './estoque.routes';
import { fornecedorRouter } from './fornecedor.routes';
import { loteEstoqueRouter } from './lote-estoque.routes';
import { movimentacaoRouter } from './movimentacao.routes';
import { produtoRouter } from './produto.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ mensagem: 'API StockPlus em execucao.' });
});

router.use('/categorias', categoriaRouter);
router.use('/fornecedores', fornecedorRouter);
router.use('/produtos', produtoRouter);
router.use('/estoques', estoqueRouter);
router.use('/lotes-estoque', loteEstoqueRouter);
router.use('/movimentacoes', movimentacaoRouter);

export default router;
