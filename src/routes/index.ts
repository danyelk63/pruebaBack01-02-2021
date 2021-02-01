import { Router } from 'express';
import productObject from './products';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/v1', productObject);

// Export the base-router
export default router;
