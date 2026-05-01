import { useBurgerBuilder } from '../../context/BurgerBuilderContext';
import './BurgerPreview.css';

const CATEGORY_COLORS: Record<string, string> = {
  energy:    '#F59E0B',
  focus:     '#00E5CC',
  immunity:  '#10B981',
  longevity: '#8B5CF6',
};

export default function BurgerPreview() {
  const { layers, getIngredientById, removeLayer } = useBurgerBuilder();

  if (layers.length === 0) {
    return (
      <div className="protocol-empty">
        <div className="protocol-empty-icon">◎</div>
        <p className="protocol-empty-text">Add supplements to begin your protocol</p>
      </div>
    );
  }

  return (
    <div className="protocol-stack">
      {layers.map((layer, index) => {
        const ingredient = getIngredientById(layer.ingredientId);
        if (!ingredient) return null;
        const color = CATEGORY_COLORS[ingredient.category] ?? '#6B6B80';

        return (
          <div
            key={`${layer.ingredientId}-${index}`}
            className="capsule"
            style={{ '--capsule-color': color } as React.CSSProperties}
            onClick={() => removeLayer(index)}
            title="Click to remove"
          >
            <span className="capsule-dot" />
            <span className="capsule-name">{ingredient.name}</span>
            {layer.quantity > 1 && (
              <span className="capsule-qty">×{layer.quantity}</span>
            )}
            <span className="capsule-remove">×</span>
          </div>
        );
      })}
    </div>
  );
}
