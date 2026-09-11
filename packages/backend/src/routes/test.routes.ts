import { Router } from 'express';
import { listTests, startTest, submitTest, startTestSchema, submitTestSchema } from '../controllers/test.controller';
import { validate } from '../middlewares/validate';

const router = Router();

// GET /api/tests — list all available test domains
router.get('/', listTests);

// POST /api/tests/start — start a new test session
router.post('/start', validate(startTestSchema), startTest);

// POST /api/tests/submit — submit answers and receive grade + certificate
router.post('/submit', validate(submitTestSchema), submitTest);

export default router;
