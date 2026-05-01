import type { Ingredient } from '../../types';
import IngredientCard from './IngredientCard';
import './IngredientList.css';

interface IngredientListProps {
  ingredients: Ingredient[];
  selectedGoal: string;
  onAdd: (id: number) => void;
}

export default function IngredientList({ ingredients, selectedGoal, onAdd }: IngredientListProps) {
  const filtered = selectedGoal === 'all'
    ? ingredients
    : ingredients.filter(i => i.category === selectedGoal);

  if (filtered.length === 0) {
    return (
      <div className="supplement-empty">
        <span className="empty-label">No supplements found</span>
      </div>
    );
  }

  return (
    <div className="supplement-grid">
      {filtered.map((ingredient, index) => (
        <div key={ingredient.id} className="fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
          <IngredientCard ingredient={ingredient} onAdd={onAdd} />
        </div>
      ))}
    </div>
  );
}
