'use client';

interface StatusBannerProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const iconMap = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const colorMap = {
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  error:   { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#f87171' },
  info:    { bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)',  text: '#60a5fa' },
  warning: { bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
};

export default function StatusBanner({ type, message, onClose }: StatusBannerProps) {
  const c = colorMap[type];

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg animate-fade-in"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <span className="text-lg" style={{ color: c.text }}>{iconMap[type]}</span>
      <p className="flex-1 text-sm font-medium" style={{ color: c.text }}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-sm opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
          style={{ color: c.text }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
