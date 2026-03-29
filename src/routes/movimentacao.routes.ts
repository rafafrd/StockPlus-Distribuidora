import { Router } from 'express';
import { MovimentacaoController } from '../controllers/movimentacao.controller';

const movimentacaoRouter = Router();
const movimentacaoController = new MovimentacaoController();

movimentacaoRouter.post('/', movimentacaoController.criar);
movimentacaoRouter.get('/', movimentacaoController.listarTodos);
movimentacaoRouter.get('/:id', movimentacaoController.buscarPorId);
movimentacaoRouter.put('/:id', movimentacaoController.atualizar);
movimentacaoRouter.delete('/:id', movimentacaoController.deletar);

export { movimentacaoRouter };
