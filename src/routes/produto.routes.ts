import { Router } from 'express';
import { ProdutoController } from '../controllers/produto.controller';

const produtoRouter = Router();
const produtoController = new ProdutoController();

produtoRouter.post('/', produtoController.criar);
produtoRouter.get('/', produtoController.listarTodos);
produtoRouter.get('/:id', produtoController.buscarPorId);
produtoRouter.put('/:id', produtoController.atualizar);
produtoRouter.delete('/:id', produtoController.deletar);

export { produtoRouter };
