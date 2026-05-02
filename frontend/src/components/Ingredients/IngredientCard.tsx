import { useState } from 'react';
import type { Ingredient } from '../../types';
import './IngredientCard.css';

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  energy: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="10" y1="1" x2="10" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="16.5" x2="10" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="1" y1="10" x2="3.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16.5" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="3.22" y1="3.22" x2="5" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="15" x2="16.78" y2="16.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16.78" y1="3.22" x2="15" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="5" y1="15" x2="3.22" y2="16.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  focus: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2C10 2 5 5.5 5 10.5C5 13.538 7.238 16 10 16C12.762 16 15 13.538 15 10.5C15 5.5 10 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="10" y1="16" x2="10" y2="18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7.5" y1="18.5" x2="12.5" y2="18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  immunity: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L3 5V10C3 13.866 6.134 17.5 10 18.5C13.866 17.5 17 13.866 17 10V5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  longevity: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10C3 7.5 5 5.5 7 5.5C8.5 5.5 9.5 6.5 10 7.5C10.5 6.5 11.5 5.5 13 5.5C15 5.5 17 7.5 17 10C17 13 13.5 15.5 10 17.5C6.5 15.5 3 13 3 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
};

interface IngredientCardProps {
  ingredient: Ingredient;
  onAdd: (id: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  energy:    'var(--energy)',
  focus:     'var(--focus)',
  immunity:  'var(--immunity)',
  longevity: 'var(--longevity)',
};

export default function IngredientCard({ ingredient, onAdd }: IngredientCardProps) {
  const [added, setAdded] = useState(false);
  const color = CATEGORY_COLORS[ingredient.category] ?? 'var(--accent-cyan)';

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    onAdd(ingredient.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  }

  return (
    <div
      className={`ingredient-card${added ? ' ingredient-card--added' : ''}`}
      onClick={handleAdd}
      style={{ '--card-accent': color } as React.CSSProperties}
    >
      <div className="card-body">
        <div className="card-header">
          <span className="card-category" style={{ color }}>
            <span className="card-icon" style={{ color }}>{CATEGORY_ICONS[ingredient.category]}</span>
            {ingredient.category}
          </span>
          <button
            className={`card-add${added ? ' card-add--added' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${ingredient.name}`}
          >
            {added ? '✓' : '+'}
          </button>
        </div>

        <div className="card-name">{ingredient.name}</div>

        <div className="card-price">
          ${ingredient.price.toFixed(2)} / serving
        </div>
      </div>
    </div>
  );
}
