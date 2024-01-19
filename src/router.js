import { Router } from 'express';
import { login, registerUser } from './handler.js';

const router = Router();

// users router
router.post('/users/register', registerUser)
router.post('/users/login', login)

// books router
router.route('/books');

// categories router
router.route('/categories');

export default router;
