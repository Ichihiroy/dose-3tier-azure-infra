import './GoalFilter.css';

const GOALS = [
  {
    label: 'All',
    value: 'all',
    color: '#6B6558',
    image: null,
    desc: 'Full catalog',
  },
  {
    label: 'Energy',
    value: 'energy',
    color: '#D4721A',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=75',
    desc: 'Vitality & stamina',
  },
  {
    label: 'Focus',
    value: 'focus',
    color: '#1A7A50',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=75',
    desc: 'Clarity & cognition',
  },
  {
    label: 'Immunity',
    value: 'immunity',
    color: '#3A9E2A',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=75',
    desc: 'Defense & resilience',
  },
  {
    label: 'Longevity',
    value: 'longevity',
    color: '#9B6CC5',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=75',
    desc: 'Ageing & renewal',
  },
];

interface GoalFilterProps {
  selected: string;
  onSelect: (value: string) => void;
}

export default function GoalFilter({ selected, onSelect }: GoalFilterProps) {
  return (
    <div className="goal-filter">
      {GOALS.map(({ label, value, color, image, desc }) => (
        <button
          key={value}
          className={`goal-card ${selected === value ? 'active' : ''}`}
          style={{ '--card-color': color } as React.CSSProperties}
          onClick={() => onSelect(value)}
        >
          {image && (
            <img
              src={image}
              alt={label}
              className="goal-card-img"
              loading="lazy"
            />
          )}
          <div className="goal-card-overlay" />
          <div className="goal-card-content">
            <span className="goal-card-label">{label}</span>
            <span className="goal-card-desc">{desc}</span>
          </div>
          {selected === value && <span className="goal-card-check">✓</span>}
        </button>
      ))}
    </div>
  );
}
