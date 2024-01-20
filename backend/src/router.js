import { Router } from 'express';
import { login, registerUser } from './handler/userHandler.js';
import * as bookHandler from './handler/bookHandler.js';
import { accessToken, checkUser } from './middleware.js';
import * as ctgHandler from './handler/categoryHandler.js';

const router = Router();

// users router
router.post('/users/register', registerUser, checkUser)
router.post('/users/login', login)

// categories router
router.use('/categories', accessToken, checkUser)
  .route('/categories')
  .post(ctgHandler.addCategory)
  .get(ctgHandler.getAllCategory)

// categories router with parameters id
router.route('/categories/:id')
  .get(ctgHandler.getCategoryByIdHandler)
  .patch(ctgHandler.editCategoryByIdHandler)
  .put(ctgHandler.editCategoryByIdHandler)
  .delete(ctgHandler.deleteCategoryByIdHandler)

// books router
router.use('/books', accessToken, checkUser)
  .route('/books')
  .post(bookHandler.addBookHandler)
  .get(bookHandler.getAllBooksHandler)

router.route('/books/:id')
  .patch(bookHandler.editBookByIdHandler)

export default router;
