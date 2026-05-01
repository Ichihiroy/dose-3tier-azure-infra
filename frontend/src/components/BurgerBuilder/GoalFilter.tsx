import './GoalFilter.css';

const GOALS = [
  { label: 'All',       value: 'all',       color: 'var(--text-muted)' },
  { label: 'Energy',    value: 'energy',    color: 'var(--energy)' },
  { label: 'Focus',     value: 'focus',     color: 'var(--focus)' },
  { label: 'Immunity',  value: 'immunity',  color: 'var(--immunity)' },
  { label: 'Longevity', value: 'longevity', color: 'var(--longevity)' },
];

interface GoalFilterProps {
  selected: string;
  onSelect: (value: string) => void;
}

export default function GoalFilter({ selected, onSelect }: GoalFilterProps) {
  return (
    <div className="goal-filter">
      {GOALS.map(({ label, value, color }) => (
        <button
          key={value}
          className={`goal-pill ${selected === value ? 'active' : ''}`}
          style={{ '--pill-color': color } as React.CSSProperties}
          onClick={() => onSelect(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
