import { Router } from 'express';
import { login, registerUser } from './handler/userHandler.js';
import { addBooks } from './handler/bookHandler.js';
import { accessToken } from './middleware.js';
import * as ctgHandler from './handler/categoryHandler.js';

const router = Router();

// users router
router.post('/users/register', registerUser)
router.post('/users/login', login)

// categories router
router.use('/books', accessToken)
  .route('/categories')
  .post(ctgHandler.addCategory)
  .get(ctgHandler.getAllCategory)

// categories router with parameters id
router.use('/books', accessToken)
  .route('/categories/:id')
  .get(ctgHandler.getCategoryByIdHandler)
  .patch(ctgHandler.editCategoryByIdHandler)
  .put(ctgHandler.editCategoryByIdHandler)
  .delete(ctgHandler.deleteCategoryByIdHandler)

// books router
router.use('/books', accessToken)
  .route('/books')
  .post(addBooks)

export default router;
