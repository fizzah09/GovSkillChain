import { Router } from 'express';
import {
  issueCertificate,
  verifyCertificateHandler,
  revokeCertificateHandler,
  listCertificatesHandler,
  issueSchema,
} from '../controllers/certificate.controller';
import { validate } from '../middlewares/validate';

const router = Router();

// GET /api/certificates - List all certificates in registry
router.get('/', listCertificatesHandler);

// POST /api/certificates/issue
router.post('/issue', validate(issueSchema), issueCertificate);

// GET /api/certificates/:tokenId/verify
router.get('/:tokenId/verify', verifyCertificateHandler);

// POST /api/certificates/:tokenId/revoke
router.post('/:tokenId/revoke', revokeCertificateHandler);

export default router;
