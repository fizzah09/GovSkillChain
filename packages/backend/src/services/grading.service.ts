import { getDomainById } from '../data/questionBank';

export interface GradingResult {
  sessionId: string;
  domainId: string;
  walletAddress: string;
  score: number;         // percentage 0-100
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  answeredAt: string;    // ISO timestamp
}

export function gradeSubmission(
  sessionId: string,
  domainId: string,
  walletAddress: string,
  answers: Record<string, number>  // questionId -> selectedIndex
): GradingResult {
  const domain = getDomainById(domainId);
  if (!domain) {
    throw new Error(`Domain not found: ${domainId}`);
  }

  let correct = 0;
  const total = domain.questions.length;

  for (const question of domain.questions) {
    const submitted = answers[question.id];
    if (submitted !== undefined && submitted === question.correctIndex) {
      correct++;
    }
  }

  const score = Math.round((correct / total) * 100);
  const passed = score >= domain.passingScore;

  return {
    sessionId,
    domainId,
    walletAddress: walletAddress.toLowerCase(),
    score,
    correctAnswers: correct,
    totalQuestions: total,
    passed,
    passingScore: domain.passingScore,
    answeredAt: new Date().toISOString(),
  };
}
