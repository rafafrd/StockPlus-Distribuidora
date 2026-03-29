import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller';

const categoriaRouter = Router();
const categoriaController = new CategoriaController();

categoriaRouter.post('/', categoriaController.criar);
categoriaRouter.get('/', categoriaController.listarTodos);
categoriaRouter.get('/:id', categoriaController.buscarPorId);
categoriaRouter.put('/:id', categoriaController.atualizar);
categoriaRouter.delete('/:id', categoriaController.deletar);

export { categoriaRouter };
