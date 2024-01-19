import { Router } from 'express';
import { login, registerUser } from './handler/userHandler.js';
import { getBooks } from './handler/bookHandler.js';
import { accessToken } from './middleware.js';
import * as ctgHandler from './handler/categoryHandler.js';

const router = Router();

// users router
router.post('/users/register', registerUser)
router.post('/users/login', login)

// categories router
router.route('/categories')
  .post(ctgHandler.addCategory)
  .get(ctgHandler.getAllCategory)

// books router
router.use('/books', accessToken)
  .route('/books')
  .get(getBooks)

export default router;
