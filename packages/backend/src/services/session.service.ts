import { randomUUID } from 'crypto';
import { TestDomain } from '../data/questionBank';

export interface TestSession {
  sessionId: string;
  domainId: string;
  walletAddress: string;
  startedAt: number;
  expiresAt: number;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
  }>;
  submitted: boolean;
}

// In-memory store: sessionId -> TestSession
const sessions = new Map<string, TestSession>();

const SESSION_TTL_MS = 40 * 60 * 1000; // 40 minutes

export function createSession(domain: TestDomain, walletAddress: string): TestSession {
  const sessionId = randomUUID();
  const now = Date.now();

  const session: TestSession = {
    sessionId,
    domainId: domain.id,
    walletAddress: walletAddress.toLowerCase(),
    startedAt: now,
    expiresAt: now + SESSION_TTL_MS,
    // Strip correct answers from client-visible data
    questions: domain.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
    })),
    submitted: false,
  };

  sessions.set(sessionId, session);

  // Auto-expire cleanup
  setTimeout(() => sessions.delete(sessionId), SESSION_TTL_MS + 5000);

  return session;
}

export function getSession(sessionId: string): TestSession | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return undefined;
  }
  return session;
}

export function markSubmitted(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) session.submitted = true;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}
