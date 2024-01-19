import { Router } from 'express';
import { login, registerUser, getBooks } from './handler.js';
import { accessToken } from './middleware.js';

const router = Router();

// users router
router.post('/users/register', registerUser)
router.post('/users/login', login)

// books router
router.use('/books', accessToken)
  .route('/books')
  .get(getBooks)

// categories router
router.route('/categories');

export default router;
