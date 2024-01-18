import { Router } from 'express';
import { registerUser } from './handler.js';

const router = Router();

// users router
router.post('/users/register', registerUser)

// books router
router.route('/books');

// categories router
router.route('/categories');

export default router;
