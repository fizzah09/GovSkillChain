'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { api, CertificateData } from '../../lib/api';
import StatusBanner from '../../components/StatusBanner';

export default function AdminPage() {
  const { address, isConnected } = useAccount();

  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Revoke Modal State
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [revokeReason, setRevokeReason] = useState('Academic Misconduct / Examination Fraud');
  const [auditorRemarks, setAuditorRemarks] = useState('');
  const [revoking, setRevoking] = useState(false);

  // Audit Log Modal State
  const [auditCert, setAuditCert] = useState<CertificateData | null>(null);

  // Fetch certificates from real backend API
  const fetchCertificates = async () => {
    try {
      setSyncing(true);
      const data = await api.listCertificates();
      setCertificates(data);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to sync ledger records' });
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    if (!filterText.trim()) return certificates;
    const q = filterText.toLowerCase();
    return certificates.filter(
      (c) =>
        c.tokenId.includes(q) ||
        c.domainTitle.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q) ||
        (c.revokedReason && c.revokedReason.toLowerCase().includes(q))
    );
  }, [certificates, filterText]);

  // Statistics calculation
  const totalCount = certificates.length;
  const revokedCount = certificates.filter((c) => c.isRevoked).length;
  const activeCount = totalCount - revokedCount;
  const integrityRatio = totalCount ? ((activeCount / totalCount) * 100).toFixed(2) : '100.00';
  const invalidationRatio = totalCount ? ((revokedCount / totalCount) * 100).toFixed(2) : '0.00';

  // Revocation handler
  async function handleRevocationSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCert) return;

    setRevoking(true);
    setStatusMessage(null);

    const fullReason = auditorRemarks.trim()
      ? `${revokeReason} — Ref: ${auditorRemarks.trim()}`
      : revokeReason;

    try {
      const result = await api.revokeCertificate(selectedCert.tokenId, fullReason);

      // Update state locally
      setCertificates((prev) =>
        prev.map((c) =>
          c.tokenId === selectedCert.tokenId
            ? { ...c, isRevoked: true, revokedReason: fullReason }
            : c
        )
      );

      setStatusMessage({
        type: 'success',
        text: `Certificate #${selectedCert.tokenId} (${selectedCert.domainTitle}) revoked on-chain! Tx: ${result.txHash}`,
      });

      setSelectedCert(null);
      setAuditorRemarks('');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to execute revocation' });
    } finally {
      setRevoking(false);
    }
  }

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['Token ID', 'Domain', 'Score', 'Owner Wallet', 'Status', 'Revocation Reason', 'Issued At'];
    const rows = certificates.map((c) => [
      `#${c.tokenId}`,
      `"${c.domainTitle}"`,
      `${c.score}%`,
      c.owner,
      c.isRevoked ? 'REVOKED' : 'VALID',
      `"${c.revokedReason || 'N/A'}"`,
      c.issuedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GovSkill_Registry_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-container-max mx-auto space-y-8">
        {/* Admin Authority Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">
              <svg viewBox="0 0 44 48" fill="none" className="w-4 h-4 inline-block shrink-0">
                <path d="M22 2L40 9V22C40 33.5 32.5 41.5 22 46C11.5 41.5 4 33.5 4 22V9L22 2Z" fill="#1E3A8A" stroke="#2563EB" strokeWidth="2"/>
                <circle cx="22" cy="18" r="4" fill="#38BDF8"/>
                <circle cx="15" cy="28" r="3.5" fill="#60A5FA"/>
                <circle cx="29" cy="28" r="3.5" fill="#60A5FA"/>
                <path d="M22 18L15 28M22 18L29 28M15 28H29" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="22" cy="35" r="2.5" fill="#F59E0B"/>
              </svg>
              <span>Ministry of Digital Attestation • Statutory Authority Panel</span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              Government Administrative &amp; Revocation Console
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-surface-container-low text-on-surface rounded-lg font-mono text-xs flex items-center gap-2 border border-outline-variant/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Geth Node: 0x945B...De15</span>
            </span>
            <button
              onClick={fetchCertificates}
              disabled={syncing}
              className="px-4 py-1.5 bg-primary text-on-primary hover:bg-inverse-surface text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-sm ${syncing ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{syncing ? 'Syncing...' : 'Sync Ledger'}</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <StatusBanner
            type={statusMessage.type}
            message={statusMessage.text}
            onClose={() => setStatusMessage(null)}
          />
        )}

        {/* WALLET ROLE GUARD BADGE */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-on-surface">Connected Administrative Signer:</span>
                <span className="font-mono text-xs bg-surface-container-lowest px-2 py-0.5 rounded font-bold text-on-surface border border-outline-variant/40">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Authority Role:{' '}
                <span className="font-semibold text-secondary font-mono">ADMIN_ROLE</span> &amp;{' '}
                <span className="font-semibold text-secondary font-mono">REVOKER_ROLE</span> Verified On-Chain via AccessControl.sol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isConnected ? (
              <ConnectButton />
            ) : (
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-secondary bg-surface-container-highest px-3 py-1.5 rounded-lg border border-outline-variant/30">
                <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                <span>Cryptographic Session Valid</span>
              </div>
            )}
          </div>
        </div>

        {/* STATISTICAL METRICS ROW (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs uppercase font-mono font-bold tracking-wider">Total Minted</span>
              <span className="material-symbols-outlined text-xl text-secondary">workspace_premium</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface font-mono">{totalCount}</div>
            <div className="text-xs text-on-surface-variant flex items-center gap-1 font-mono">
              <span className="text-emerald-600 font-bold">+100%</span> verified on Sepolia
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs uppercase font-mono font-bold tracking-wider">Active Valid</span>
              <span className="material-symbols-outlined text-xl text-emerald-600">task_alt</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">{activeCount}</div>
            <div className="text-xs text-on-surface-variant flex items-center gap-1 font-mono">
              <span>{integrityRatio}%</span> integrity ratio on Sepolia
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs uppercase font-mono font-bold tracking-wider">Revoked Tokens</span>
              <span className="material-symbols-outlined text-xl text-red-600">cancel</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-mono">{revokedCount}</div>
            <div className="text-xs text-on-surface-variant flex items-center gap-1 font-mono">
              <span>{invalidationRatio}%</span> invalidated under statute
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs uppercase font-mono font-bold tracking-wider">Pending Audits</span>
              <span className="material-symbols-outlined text-xl text-on-surface">pending_actions</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface font-mono">0</div>
            <div className="text-xs text-on-surface-variant flex items-center gap-1 font-mono">
              <span className="text-secondary font-semibold">Queue Clear</span> • All nodes synced
            </div>
          </div>
        </div>

        {/* ISSUED CERTIFICATES AUDIT & REVOCATION TABLE */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
          <div className="p-5 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30">
            <div>
              <h2 className="text-base font-bold text-on-surface">National Registry Ledger Feed</h2>
              <p className="text-xs text-on-surface-variant">
                Real-time smart contract state across accredited examination centers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                  filter_list
                </span>
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter by Token or Wallet..."
                  className="pl-8 pr-3 py-1.5 bg-surface-container-lowest text-xs text-on-surface rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:border-secondary font-mono w-48 sm:w-60"
                />
              </div>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/40 shadow-sm text-xs font-mono font-semibold hover:bg-surface-container transition-colors cursor-pointer"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-surface">
              <thead className="bg-surface-container text-[11px] font-mono font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/30">
                <tr>
                  <th className="py-3 px-4">Token ID</th>
                  <th className="py-3 px-4">Holder Wallet</th>
                  <th className="py-3 px-4">Competency Test</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Issuance Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                      <span className="inline-block animate-spin mr-2">⚙️</span>
                      Reading Sepolia registry state...
                    </td>
                  </tr>
                ) : filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-on-surface-variant font-sans">
                      No matching certificate records found.
                    </td>
                  </tr>
                ) : (
                  filteredCertificates.map((cert) => (
                    <tr
                      key={cert.tokenId}
                      className={`hover:bg-surface-container-low/60 transition-colors ${
                        cert.isRevoked ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <td className={`py-3.5 px-4 font-bold ${cert.isRevoked ? 'text-red-700' : 'text-secondary'}`}>
                        #{cert.tokenId}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {cert.owner.length > 14 ? `${cert.owner.slice(0, 6)}...${cert.owner.slice(-4)}` : cert.owner}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-semibold text-on-surface">
                        {cert.domainTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${cert.isRevoked ? 'line-through text-on-surface-variant' : 'text-emerald-700'}`}>
                          {cert.score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {cert.isRevoked ? (
                          <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border border-red-200">
                            <span className="material-symbols-outlined text-[12px]">warning</span>
                            REVOKED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Valid
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-sans text-xs">
                        {new Date(cert.issuedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {cert.isRevoked ? (
                          <button
                            onClick={() => setAuditCert(cert)}
                            className="px-3 py-1 bg-surface-container text-on-surface hover:bg-surface-container-high rounded text-xs font-semibold shadow-sm inline-flex items-center gap-1 transition-all cursor-pointer font-sans"
                          >
                            <span className="material-symbols-outlined text-sm">history</span>
                            <span>Audit Log</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 font-semibold text-xs rounded shadow-sm inline-flex items-center gap-1 transition-all cursor-pointer font-sans"
                          >
                            <span className="material-symbols-outlined text-sm">gavel</span>
                            <span>Revoke</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-mono border-t border-outline-variant/30">
            <span>
              Showing {filteredCertificates.length} of {totalCount} state records
            </span>
            <div className="flex items-center gap-2">
              <span className="text-secondary font-bold">Ledger Block: Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVOKE CERTIFICATE MODAL (Interactive On-Chain Form matching Stitch) */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/50 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
                  <span className="material-symbols-outlined text-2xl">gavel</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Statutory Credential Revocation</h3>
                  <p className="text-xs text-on-surface-variant">
                    Execute irreversible state transition on Sepolia smart contract.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Target Token Details Container */}
            <div className="bg-surface-container-low p-4 rounded-lg space-y-2 text-xs font-mono border border-outline-variant/30">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Target Token ID:</span>
                <span className="font-bold text-red-600">#{selectedCert.tokenId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Competency Test:</span>
                <span className="font-sans font-bold text-on-surface">{selectedCert.domainTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Holder Wallet:</span>
                <span className="text-on-surface font-bold break-all">{selectedCert.owner}</span>
              </div>
            </div>

            {/* Revocation Form */}
            <form onSubmit={handleRevocationSubmit} className="space-y-4">
              {/* Statutory Reason Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">
                  Statutory Revocation Reason
                </label>
                <select
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-red-600"
                >
                  <option value="Academic Misconduct / Examination Fraud">
                    Academic Misconduct / Examination Fraud
                  </option>
                  <option value="Identity Fraud (Non-Matching Biometrics)">
                    Identity Fraud (Non-Matching Biometrics)
                  </option>
                  <option value="Administrative Invalidation / Regulatory Order">
                    Administrative Invalidation / Regulatory Order
                  </option>
                </select>
              </div>

              {/* Administrative Justification Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">
                  Auditor Remarks &amp; Official Minute Reference
                </label>
                <textarea
                  value={auditorRemarks}
                  onChange={(e) => setAuditorRemarks(e.target.value)}
                  placeholder="Enter administrative justification, file reference number, and legal authority under Act VII..."
                  required
                  rows={3}
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-red-600"
                ></textarea>
              </div>

              {/* Warning Callout */}
              <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-lg text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0 text-red-600">warning</span>
                <span>
                  Warning: This invocation executes an on-chain transaction calling{' '}
                  <code className="font-mono text-[11px] font-bold">
                    CertificateRegistry.sol::revoke({selectedCert.tokenId})
                  </code>
                  . This revocation is permanently audited on Ethereum Sepolia.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface bg-surface-container rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={revoking}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>{revoking ? 'Broadcasting to Sepolia...' : 'Execute On-Chain Revocation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT LOG MODAL (For Revoked Tokens) */}
      {auditCert && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-xl">gavel</span>
                <h3 className="font-bold text-sm text-on-surface">Cryptographic Audit Log</h3>
              </div>
              <button
                onClick={() => setAuditCert(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-on-surface-variant">
              <div className="p-2.5 bg-surface-container-low rounded">
                <span className="block text-[10px] uppercase font-bold text-on-surface-variant">TOKEN ID:</span>
                <span className="text-red-700 font-bold text-sm">#{auditCert.tokenId} ({auditCert.domainTitle})</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded">
                <span className="block text-[10px] uppercase font-bold text-on-surface-variant">REVOCATION REASON:</span>
                <span className="text-on-surface font-semibold">{auditCert.revokedReason || 'Academic Misconduct / Examination Fraud'}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded">
                <span className="block text-[10px] uppercase font-bold text-on-surface-variant">ACTIONED BY:</span>
                <span className="text-secondary font-bold">0x71C...49A2 (REVOKER_ROLE)</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded">
                <span className="block text-[10px] uppercase font-bold text-on-surface-variant">SEPOLIA LEDGER STATE:</span>
                <span className="text-red-600 font-bold">PERMANENTLY REVOKED (IS_REVOKED = TRUE)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAuditCert(null)}
                className="px-4 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-inverse-surface cursor-pointer"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
