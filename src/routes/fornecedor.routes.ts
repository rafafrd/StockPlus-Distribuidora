import { Router } from 'express';
import { FornecedorController } from '../controllers/fornecedor.controller';

const fornecedorRouter = Router();
const fornecedorController = new FornecedorController();

fornecedorRouter.post('/', fornecedorController.criar);
fornecedorRouter.get('/', fornecedorController.listarTodos);
fornecedorRouter.get('/:id', fornecedorController.buscarPorId);
fornecedorRouter.put('/:id', fornecedorController.atualizar);
fornecedorRouter.delete('/:id', fornecedorController.deletar);

export { fornecedorRouter };
