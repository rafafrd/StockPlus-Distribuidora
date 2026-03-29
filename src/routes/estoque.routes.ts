import { Router } from 'express';
import { EstoqueController } from '../controllers/estoque.controller';

const estoqueRouter = Router();
const estoqueController = new EstoqueController();

estoqueRouter.post('/', estoqueController.criar);
estoqueRouter.get('/', estoqueController.listarTodos);
estoqueRouter.get('/:id', estoqueController.buscarPorId);
estoqueRouter.put('/:id', estoqueController.atualizar);
estoqueRouter.delete('/:id', estoqueController.deletar);

export { estoqueRouter };
