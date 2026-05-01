import type { BurgerLayer, Ingredient } from '../../types';
import './MetricsPanel.css';

interface MetricsPanelProps {
  layers: BurgerLayer[];
  ingredients: Ingredient[];
  totalPrice: number;
}

const CATEGORIES = [
  { key: 'energy',    label: 'Energy',    color: 'var(--energy)' },
  { key: 'focus',     label: 'Focus',     color: 'var(--focus)' },
  { key: 'immunity',  label: 'Immunity',  color: 'var(--immunity)' },
  { key: 'longevity', label: 'Longevity', color: 'var(--longevity)' },
];

const MAX_PER_CATEGORY = 3;

export default function MetricsPanel({ layers, ingredients, totalPrice }: MetricsPanelProps) {
  const getCategory = (ingredientId: number) =>
    ingredients.find(i => i.id === ingredientId)?.category ?? '';

  const countByCategory = (cat: string) =>
    layers.filter(l => getCategory(l.ingredientId) === cat).length;

  return (
    <div className="metrics-panel">
      <div className="metrics-row">
        <div className="metric-block">
          <span className="metric-label">Protocol Cost</span>
          <span className="metric-value">${totalPrice.toFixed(2)}</span>
          <span className="metric-sub">per month</span>
        </div>
        <div className="metric-block">
          <span className="metric-label">Supplements</span>
          <span className="metric-value">{layers.length}</span>
          <span className="metric-sub">selected</span>
        </div>
      </div>

      <div className="coverage-section">
        <span className="coverage-label">Coverage</span>
        {CATEGORIES.map(({ key, label, color }) => {
          const count = countByCategory(key);
          const pct = Math.min((count / MAX_PER_CATEGORY) * 100, 100);
          return (
            <div key={key} className="coverage-row">
              <span className="coverage-cat">{label}</span>
              <div className="coverage-track">
                <div
                  className="coverage-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="coverage-count" style={{ color }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
