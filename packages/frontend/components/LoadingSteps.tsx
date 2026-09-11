'use client';

interface Step {
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
}

interface LoadingStepsProps {
  steps: Step[];
  title?: string;
}

export default function LoadingSteps({ steps, title }: LoadingStepsProps) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background:
                  step.status === 'done'   ? 'rgba(16,185,129,0.2)' :
                  step.status === 'active'  ? 'rgba(59,130,246,0.2)' :
                  step.status === 'error'   ? 'rgba(239,68,68,0.2)' :
                                              'rgba(100,116,139,0.15)',
                border: `1px solid ${
                  step.status === 'done'   ? 'rgba(16,185,129,0.4)' :
                  step.status === 'active'  ? 'rgba(59,130,246,0.4)' :
                  step.status === 'error'   ? 'rgba(239,68,68,0.4)' :
                                              'rgba(100,116,139,0.2)'
                }`,
                color:
                  step.status === 'done'   ? '#34d399' :
                  step.status === 'active'  ? '#60a5fa' :
                  step.status === 'error'   ? '#f87171' :
                                              '#64748b',
              }}
            >
              {step.status === 'done'  ? '✓' :
               step.status === 'error' ? '✕' :
               step.status === 'active' ? (
                <span className="animate-spin text-[10px]">⟳</span>
              ) : (
                i + 1
              )}
            </div>

            {/* Label */}
            <span
              className="text-sm font-medium"
              style={{
                color:
                  step.status === 'done'   ? '#34d399' :
                  step.status === 'active'  ? '#e2e8f0' :
                  step.status === 'error'   ? '#f87171' :
                                              '#64748b',
              }}
            >
              {step.label}
            </span>

            {/* Spinner */}
            {step.status === 'active' && (
              <div className="ml-auto">
                <div
                  className="w-4 h-4 border-2 rounded-full"
                  style={{
                    borderColor: 'rgba(59,130,246,0.2)',
                    borderTopColor: '#3b82f6',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
