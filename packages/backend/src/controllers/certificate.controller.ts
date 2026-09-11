import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  mintCertificate,
  verifyCertificate,
  revokeCertificate,
  listAllCertificates,
} from '../services/blockchain.service';
import { createError } from '../middlewares/errorHandler';
import { GradingResult } from '../services/grading.service';

export const issueSchema = z.object({
  sessionId: z.string(),
  domainId: z.string(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  score: z.number().int().min(0).max(100),
  correctAnswers: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  passed: z.boolean(),
  passingScore: z.number().int(),
  answeredAt: z.string(),
});

// GET /api/certificates
export async function listCertificatesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const list = await listAllCertificates();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

// POST /api/certificates/issue
export async function issueCertificate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const gradingResult = req.body as GradingResult;

    if (!gradingResult.passed) {
      return next(
        createError('Cannot issue certificate — test was not passed', 400, 'TEST_NOT_PASSED')
      );
    }

    const mintResult = await mintCertificate(gradingResult);

    res.status(201).json({
      success: true,
      data: {
        tokenId: mintResult.tokenId,
        txHash: mintResult.txHash,
        owner: gradingResult.walletAddress,
        domainId: gradingResult.domainId,
        score: gradingResult.score,
        issuedAt: gradingResult.answeredAt,
        demo: mintResult.demo,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/certificates/:tokenId/verify
export async function verifyCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tokenId } = req.params;

    // Prevent caching for real-time verification accuracy & immediate revocation detection
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const cert = await verifyCertificate(tokenId);

    if (!cert) {
      return next(
        createError(`Certificate with tokenId '${tokenId}' not found`, 404, 'CERTIFICATE_NOT_FOUND')
      );
    }

    res.json({ success: true, data: cert });
  } catch (err) {
    next(err);
  }
}

// POST /api/certificates/:tokenId/revoke
export async function revokeCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tokenId } = req.params;
    const { reason } = req.body || {};

    const result = await revokeCertificate(tokenId, reason);

    res.json({
      success: true,
      data: {
        tokenId,
        txHash: result.txHash,
        revokedAt: new Date().toISOString(),
        reason: reason || 'Administrative Invalidation',
        demo: result.demo,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return next(createError(err.message, 400, 'REVOKE_ERROR'));
    }
    next(err);
  }
}
