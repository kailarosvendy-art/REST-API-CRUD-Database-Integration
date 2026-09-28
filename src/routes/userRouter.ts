import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', (_req, res) => {
  // #swagger.responses[200] = { description: 'Daftar pengguna (tanpa password hash)' }
  return userController.getUsers(_req, res);
});

userRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
  // #swagger.responses[201] = { description: 'Pengguna berhasil dibuat' }
  return userController.createUser(req, res);
});

export { userRouter };