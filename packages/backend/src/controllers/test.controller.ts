import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { questionBank, getDomainById } from '../data/questionBank';
import { createSession, getSession, markSubmitted } from '../services/session.service';
import { gradeSubmission } from '../services/grading.service';
import { mintCertificate } from '../services/blockchain.service';
import { createError } from '../middlewares/errorHandler';

// --- Schema Definitions ---
export const startTestSchema = z.object({
  domainId: z.string().min(1),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

export const submitTestSchema = z.object({
  sessionId: z.string().uuid(),
  answers: z.record(z.string(), z.number().int().min(0).max(3)),
});

// GET /api/tests
export async function listTests(_req: Request, res: Response): Promise<void> {
  const domains = questionBank.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    passingScore: d.passingScore,
    durationMinutes: d.durationMinutes,
    questionCount: d.questions.length,
  }));

  res.json({ success: true, data: domains });
}

// POST /api/tests/start
export async function startTest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { domainId, walletAddress } = req.body as z.infer<typeof startTestSchema>;

    const domain = getDomainById(domainId);
    if (!domain) {
      return next(createError(`Test domain '${domainId}' not found`, 404, 'DOMAIN_NOT_FOUND'));
    }

    const session = createSession(domain, walletAddress);

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        domainId: session.domainId,
        expiresAt: session.expiresAt,
        durationMinutes: domain.durationMinutes,
        questions: session.questions,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/tests/submit
export async function submitTest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId, answers } = req.body as z.infer<typeof submitTestSchema>;

    const session = getSession(sessionId);
    if (!session) {
      return next(createError('Session not found or has expired', 404, 'SESSION_NOT_FOUND'));
    }
    if (session.submitted) {
      return next(createError('Test already submitted', 409, 'ALREADY_SUBMITTED'));
    }

    const result = gradeSubmission(sessionId, session.domainId, session.walletAddress, answers);
    markSubmitted(sessionId);

    let mintResult = null;
    if (result.passed) {
      try {
        mintResult = await mintCertificate(result);
      } catch (mintErr) {
        console.error('[Submit] Minting failed but still returning grade result:', mintErr);
      }
    }

    res.json({
      success: true,
      data: {
        ...result,
        certificate: mintResult
          ? {
              tokenId: mintResult.tokenId,
              txHash: mintResult.txHash,
              demo: mintResult.demo,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
}
