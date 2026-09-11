'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { CertificateData } from '../lib/api';

interface CitizenContextType {
  citizenId: string;
  setCitizenId: (id: string) => void;
  citizenName: string;
  setCitizenName: (name: string) => void;
  isIdentityVerified: boolean;
  setIdentityVerified: (v: boolean) => void;
  certificates: CertificateData[];
  addCertificate: (cert: CertificateData) => void;
  clearCertificates: () => void;
  lastTestResult: TestResult | null;
  setLastTestResult: (r: TestResult | null) => void;
}

export interface TestResult {
  sessionId: string;
  domainId: string;
  domainTitle: string;
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

const CitizenContext = createContext<CitizenContextType | null>(null);

export function CitizenProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();

  const [citizenId, setCitizenIdState] = useState<string>('');
  const [citizenName, setCitizenNameState] = useState<string>('');
  const [isIdentityVerified, setIdentityVerified] = useState(false);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('govskill_citizen_id');
      const savedName = localStorage.getItem('govskill_citizen_name');
      if (savedId) setCitizenIdState(savedId);
      if (savedName) setCitizenNameState(savedName);
      if (savedId && isConnected) setIdentityVerified(true);
    }
  }, [isConnected]);

  const setCitizenId = (id: string) => {
    setCitizenIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('govskill_citizen_id', id);
    }
  };

  const setCitizenName = (name: string) => {
    setCitizenNameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('govskill_citizen_name', name);
    }
  };

  // Reset identity when wallet disconnects
  useEffect(() => {
    if (!address) {
      setIdentityVerified(false);
      setLastTestResult(null);
    } else if (citizenId) {
      setIdentityVerified(true);
    }
  }, [address, citizenId]);

  const addCertificate = useCallback((cert: CertificateData) => {
    setCertificates((prev) => {
      if (prev.find((c) => c.tokenId === cert.tokenId)) return prev;
      return [cert, ...prev];
    });
  }, []);

  const clearCertificates = useCallback(() => setCertificates([]), []);

  return (
    <CitizenContext.Provider
      value={{
        citizenId,
        setCitizenId,
        citizenName,
        setCitizenName,
        isIdentityVerified,
        setIdentityVerified,
        certificates,
        addCertificate,
        clearCertificates,
        lastTestResult,
        setLastTestResult,
      }}
    >
      {children}
    </CitizenContext.Provider>
  );
}

export function useCitizen(): CitizenContextType {
  const ctx = useContext(CitizenContext);
  if (!ctx) throw new Error('useCitizen must be used inside <CitizenProvider>');
  return ctx;
}
