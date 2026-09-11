'use client';

interface QuestionCardProps {
  index: number;
  total: number;
  question: {
    id: string;
    text: string;
    options: string[];
  };
  selectedAnswer: number | undefined;
  onSelect: (questionId: string, optionIndex: number) => void;
}

export default function QuestionCard({ index, total, question, selectedAnswer, onSelect }: QuestionCardProps) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="badge badge-blue">Question {index + 1} of {total}</span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {question.id}
        </span>
      </div>

      {/* Question text */}
      <h3 className="text-lg font-semibold text-white mb-5 leading-relaxed">
        {question.text}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(question.id, i)}
              className="w-full text-left flex items-center gap-3 p-4 rounded-lg transition-all border cursor-pointer"
              style={{
                background: isSelected ? 'rgba(59,130,246,0.12)' : 'rgba(15,22,41,0.6)',
                borderColor: isSelected ? 'rgba(59,130,246,0.5)' : 'var(--border-subtle)',
                color: isSelected ? '#e2e8f0' : '#94a3b8',
              }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: isSelected ? '#3b82f6' : 'rgba(100,116,139,0.15)',
                  color: isSelected ? '#fff' : '#64748b',
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm font-medium">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
