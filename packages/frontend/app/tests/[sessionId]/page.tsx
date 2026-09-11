'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, TestQuestion, SubmitResult } from '../../../lib/api';
import { useCitizen } from '../../../context/CitizenContext';
import StatusBanner from '../../../components/StatusBanner';
import LoadingSteps from '../../../components/LoadingSteps';
import Link from 'next/link';

export default function ExamPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { addCertificate } = useCitizen();

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [domainId, setDomainId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 min default
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState('');

  // Load session
  useEffect(() => {
    const raw = sessionStorage.getItem(`session_${sessionId}`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setQuestions(data.questions || []);
        setDomainId(data.domainId || '');
        const durationSec = (data.durationMinutes || 20) * 60;
        setTimeLeft(durationSec);
      } catch {}
    }
    setLoading(false);
  }, [sessionId]);

  // Timer countdown
  useEffect(() => {
    if (result || submitting || loading) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result, submitting, loading]);

  function handleSelect(optionIndex: number) {
    const q = questions[currentIndex];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await api.submitTest(sessionId, answers);
      setResult(res);

      if (res.passed && res.certificate) {
        addCertificate({
          tokenId: res.certificate.tokenId,
          owner: res.walletAddress,
          domainId: res.domainId,
          domainTitle: res.domainId,
          score: res.score,
          issuedAt: res.answeredAt,
          isRevoked: false,
          demo: res.certificate.demo,
        });
      }
    } catch (e: any) {
      setError(e.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto py-20 px-4 text-center">
        <div className="inline-block animate-spin text-3xl mb-3">⚙️</div>
        <p className="text-sm font-mono text-on-surface-variant">Loading examination session...</p>
      </div>
    );
  }

  // === RESULT VIEW ===
  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/60 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2 border-dashed border-outline-variant/60 bg-surface-container">
            <span className="material-symbols-outlined text-4xl text-secondary">
              {result.passed ? 'workspace_premium' : 'assignment_late'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-secondary">
              Official Assessment Outcome
            </span>
            <h1 className="text-3xl font-extrabold text-on-surface mt-1">
              {result.passed ? 'Competency Attestation Confirmed' : 'Assessment Threshold Not Met'}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {result.passed
                ? 'Your score satisfies federal requirements. A Soulbound NFT credential has been registered.'
                : 'You did not meet the required passing mark for this examination.'}
            </p>
          </div>

          {/* Score Matrix */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-lg font-mono text-xs border border-outline-variant/30">
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">Score Earned</span>
              <span className={`text-2xl font-extrabold ${result.passed ? 'text-emerald-700' : 'text-red-600'}`}>
                {result.score}%
              </span>
            </div>
            <div className="border-x border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant block uppercase">Correct Answers</span>
              <span className="text-2xl font-extrabold text-on-surface">
                {result.correctAnswers} / {result.totalQuestions}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">Passing Required</span>
              <span className="text-2xl font-extrabold text-on-surface">{result.passingScore}%</span>
            </div>
          </div>

          {/* Certificate NFT Details (if passed) */}
          {result.passed && result.certificate && (
            <div className="p-5 bg-surface-container-lowest border border-secondary/40 rounded-xl text-left space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">verified</span>
                  <span className="font-bold text-sm text-on-surface">ERC-5192 Soulbound Certificate</span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded">
                  TOKEN #{result.certificate.tokenId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-on-surface-variant bg-surface-container-low p-3 rounded">
                <div>
                  <span className="text-[10px] text-on-surface-variant block">HOLDER WALLET</span>
                  <span className="text-on-surface font-bold truncate block">{result.walletAddress}</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block">TX HASH</span>
                  <span className="text-secondary font-bold truncate block">{result.certificate.txHash}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href={`/verify/${result.certificate.tokenId}`}
                  className="px-4 py-2 bg-primary text-on-primary font-semibold text-xs rounded-lg no-underline hover:bg-inverse-surface transition-colors"
                >
                  Inspect on Public Registry
                </Link>
                <Link
                  href="/certificates"
                  className="px-4 py-2 bg-surface-container-high text-on-surface font-semibold text-xs rounded-lg no-underline hover:bg-surface-container transition-colors"
                >
                  My Certificates
                </Link>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/tests"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Return to Assessment Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // === LIVE EXAMINATION INTERFACE ===
  const currentQ = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = total ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Proctoring & Examination Top Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm text-emerald-600">security</span>
            <span>SECURE PROCTORED SESSION</span>
            <span>•</span>
            <span className="uppercase font-bold text-secondary">{domainId}</span>
          </div>
          <h2 className="text-lg font-bold text-on-surface mt-0.5">
            Question {currentIndex + 1} of {total}
          </h2>
        </div>

        {/* Live Timer Countdown */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold border ${
            timeLeft < 300
              ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
              : 'bg-surface-container-high text-on-surface border-outline-variant/40'
          }`}
        >
          <span className="material-symbols-outlined text-base">timer</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-container rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="bg-secondary h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {error && <StatusBanner type="error" message={error} onClose={() => setError('')} />}

      {/* Question Card */}
      {currentQ && (
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant/40 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-mono text-secondary font-bold uppercase tracking-wider">
              Item Ref: {currentQ.id}
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mt-1 leading-snug">
              {currentQ.text}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-lg border text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-secondary/10 border-secondary text-secondary font-semibold shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/40 hover:bg-surface-container hover:border-outline-variant text-on-surface'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-secondary bg-secondary text-white'
                        : 'border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-outline-variant/40 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            {currentIndex < total - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                className="px-5 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-inverse-surface transition-colors shadow-sm"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-secondary/90 transition-colors shadow-md disabled:opacity-50"
              >
                {submitting ? 'Submitting & Grading...' : 'Submit Official Examination'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
