import { useBurgerBuilder } from '../../context/BurgerBuilderContext';
import './BurgerPreview.css';

const CATEGORY_COLORS: Record<string, string> = {
  energy:    '#C4781A',
  focus:     '#2D5A3D',
  immunity:  '#5A8C3D',
  longevity: '#7B5EA7',
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
