import { Router, Request, Response } from 'express';
import { DEMO_MODE } from '../config/blockchain.config';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'GovSkill Chain API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demo: DEMO_MODE,
    network: DEMO_MODE ? 'demo' : 'sepolia',
  });
});

export default router;
