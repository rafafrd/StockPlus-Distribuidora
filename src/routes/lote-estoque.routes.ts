import { Router } from 'express';
import { LoteEstoqueController } from '../controllers/lote-estoque.controller';

const loteEstoqueRouter = Router();
const loteEstoqueController = new LoteEstoqueController();

loteEstoqueRouter.post('/', loteEstoqueController.criar);
loteEstoqueRouter.get('/', loteEstoqueController.listarTodos);
loteEstoqueRouter.get('/:id', loteEstoqueController.buscarPorId);
loteEstoqueRouter.put('/:id', loteEstoqueController.atualizar);
loteEstoqueRouter.delete('/:id', loteEstoqueController.deletar);

export { loteEstoqueRouter };
