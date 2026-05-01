import type { Ingredient } from '../../types';
import './StarterProtocols.css';

const PRESETS: { label: string; tag: string; names: string[] }[] = [
  {
    label: 'The Executive',
    tag: 'Performance',
    names: ['Ashwagandha', "Lion's Mane", 'NMN', 'Omega-3'],
  },
  {
    label: 'The Athlete',
    tag: 'Recovery',
    names: ['CoQ10', 'Rhodiola Rosea', 'Zinc Picolinate', 'Vitamin D3 + K2'],
  },
  {
    label: 'The Focalist',
    tag: 'Cognition',
    names: ['L-Theanine', 'Bacopa Monnieri', 'Alpha-GPC', 'Vitamin B12'],
  },
];

interface StarterProtocolsProps {
  ingredients: Ingredient[];
  onLoad: (ids: number[]) => void;
}

export default function StarterProtocols({ ingredients, onLoad }: StarterProtocolsProps) {
  const handlePreset = (names: string[]) => {
    const ids = names
      .map(name => ingredients.find(i => i.name === name)?.id)
      .filter((id): id is number => id !== undefined);
    onLoad(ids);
  };

  return (
    <div className="starter-protocols">
      <span className="starter-label">Starter Protocols</span>
      <div className="starter-list">
        {PRESETS.map(({ label, tag, names }) => (
          <button
            key={label}
            className="starter-btn"
            onClick={() => handlePreset(names)}
          >
            <span className="starter-btn-label">{label}</span>
            <span className="starter-btn-tag">{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
