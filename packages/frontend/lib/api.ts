const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://backend-withered-tidepool-24.fly.dev';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    const msg = json?.error?.message || `API error ${res.status}`;
    throw new Error(msg);
  }

  return json.data as T;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface TestDomain {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  durationMinutes: number;
  questionCount: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface TestSession {
  sessionId: string;
  domainId: string;
  expiresAt: number;
  durationMinutes: number;
  questions: TestQuestion[];
}

export interface SubmitResult {
  sessionId: string;
  domainId: string;
  walletAddress: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  answeredAt: string;
  certificate: {
    tokenId: string;
    txHash: string;
    demo: boolean;
  } | null;
}

export interface CertificateData {
  tokenId: string;
  owner: string;
  domainId: string;
  domainTitle: string;
  score: number;
  issuedAt: string;
  isRevoked: boolean;
  revokedReason?: string;
  demo: boolean;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  demo: boolean;
  network: string;
}

// ── API Functions ─────────────────────────────────────────────────────────────

export const api = {
  health: () => apiFetch<HealthStatus>('/health'),

  listTests: () => apiFetch<TestDomain[]>('/api/tests'),

  startTest: (domainId: string, walletAddress: string) =>
    apiFetch<TestSession>('/api/tests/start', {
      method: 'POST',
      body: JSON.stringify({ domainId, walletAddress }),
    }),

  submitTest: (sessionId: string, answers: Record<string, number>) =>
    apiFetch<SubmitResult>('/api/tests/submit', {
      method: 'POST',
      body: JSON.stringify({ sessionId, answers }),
    }),

  listCertificates: () => apiFetch<CertificateData[]>('/api/certificates'),

  verifyCertificate: (tokenId: string) =>
    apiFetch<CertificateData>(`/api/certificates/${tokenId}/verify`),

  revokeCertificate: (tokenId: string, reason?: string) =>
    apiFetch<{ tokenId: string; txHash: string; revokedAt: string; reason?: string; demo: boolean }>(
      `/api/certificates/${tokenId}/revoke`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }
    ),
};
