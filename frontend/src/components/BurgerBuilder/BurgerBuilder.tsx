import React, { useEffect, useState } from 'react';
import { useBurgerBuilder } from '../../context/BurgerBuilderContext';
import { useCart } from '../../context/CartContext';
import { getIngredients } from '../../services/api';
import BurgerPreview from './BurgerPreview';
import IngredientList from '../Ingredients/IngredientList';
import GoalFilter from './GoalFilter';
import StarterProtocols from './StarterProtocols';
import MetricsPanel from './MetricsPanel';
import type { Ingredient } from '../../types';
import './BurgerBuilder.css';

const SAMPLE_INGREDIENTS: Ingredient[] = [
  { id: 1,  name: 'Ashwagandha',      category: 'energy',    price: 0.89, imageUrl: null },
  { id: 2,  name: 'Rhodiola Rosea',   category: 'energy',    price: 1.20, imageUrl: null },
  { id: 3,  name: 'CoQ10',            category: 'energy',    price: 1.50, imageUrl: null },
  { id: 4,  name: 'B-Complex',        category: 'energy',    price: 0.75, imageUrl: null },
  { id: 5,  name: 'Maca Root',        category: 'energy',    price: 0.95, imageUrl: null },
  { id: 6,  name: "Lion's Mane",      category: 'focus',     price: 1.10, imageUrl: null },
  { id: 7,  name: 'L-Theanine',       category: 'focus',     price: 0.65, imageUrl: null },
  { id: 8,  name: 'Alpha-GPC',        category: 'focus',     price: 1.80, imageUrl: null },
  { id: 9,  name: 'Bacopa Monnieri',  category: 'focus',     price: 0.90, imageUrl: null },
  { id: 10, name: 'Phosphatidylserine', category: 'focus',   price: 1.40, imageUrl: null },
  { id: 11, name: 'Vitamin C',        category: 'immunity',  price: 0.30, imageUrl: null },
  { id: 12, name: 'Vitamin D3 + K2',  category: 'immunity',  price: 0.55, imageUrl: null },
  { id: 13, name: 'Zinc Picolinate',  category: 'immunity',  price: 0.45, imageUrl: null },
  { id: 14, name: 'Elderberry',       category: 'immunity',  price: 0.80, imageUrl: null },
  { id: 15, name: 'Quercetin',        category: 'immunity',  price: 1.00, imageUrl: null },
  { id: 16, name: 'NMN',             category: 'longevity', price: 2.50, imageUrl: null },
  { id: 17, name: 'Omega-3',         category: 'longevity', price: 0.70, imageUrl: null },
  { id: 18, name: 'Resveratrol',     category: 'longevity', price: 1.60, imageUrl: null },
  { id: 19, name: 'Collagen Peptides', category: 'longevity', price: 1.20, imageUrl: null },
  { id: 20, name: 'Magnesium Glycinate', category: 'longevity', price: 0.60, imageUrl: null },
];

const BurgerBuilder: React.FC = () => {
  const {
    layers,
    ingredients,
    setIngredients,
    addLayer,
    clearLayers,
    getTotalPrice,
  } = useBurgerBuilder();

  const { addItemToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState('all');

  useEffect(() => {
    loadIngredients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await getIngredients();
      const allIngredients = Array.isArray(data) ? data : [
        ...data.buns, ...data.patties, ...data.toppings, ...data.sauces,
      ];
      setIngredients(allIngredients);
    } catch {
      setIngredients(SAMPLE_INGREDIENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = (ids: number[]) => {
    clearLayers();
    ids.forEach(id => addLayer(id));
  };

  const handleAddToStack = (id: number) => {
    addLayer(id);
  };

  const handleSubscribe = () => {
    if (layers.length === 0) {
      showNotification('Add supplements to your protocol first.');
      return;
    }
    addItemToCart({
      id: Date.now(),
      layers,
      totalPrice: getTotalPrice(),
      quantity: 1,
    });
    clearLayers();
    showNotification('Protocol added to your stack.');
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="bb-loading">
        <span className="bb-loading-dot" />
        <span className="bb-loading-dot" />
        <span className="bb-loading-dot" />
      </div>
    );
  }

  return (
    <div className="bb-root">
      {notification && <div className="bb-toast">{notification}</div>}

      <div className="bb-layout">
        {/* Left: catalog */}
        <div className="bb-catalog">
          <div className="bb-catalog-header">
            <h1 className="bb-title">Protocol Studio</h1>
            <p className="bb-subtitle">Build your personalized supplement stack</p>
          </div>
          <GoalFilter selected={selectedGoal} onSelect={setSelectedGoal} />
          <IngredientList
            ingredients={ingredients}
            selectedGoal={selectedGoal}
            onAdd={handleAddToStack}
          />
        </div>

        {/* Right: protocol panel */}
        <div className="bb-panel">
          <div className="bb-panel-sticky">
            <StarterProtocols ingredients={ingredients} onLoad={handleLoadPreset} />
            <BurgerPreview />
            <MetricsPanel
              layers={layers}
              ingredients={ingredients}
              totalPrice={getTotalPrice()}
            />
            <div className="bb-cta">
              <button
                className="bb-subscribe-btn"
                onClick={handleSubscribe}
                disabled={layers.length === 0}
              >
                <span className="bb-subscribe-label">Subscribe</span>
                <span className="bb-subscribe-price">
                  ${getTotalPrice().toFixed(2)}<span className="bb-subscribe-freq">/mo</span>
                </span>
              </button>
              <button
                className="bb-clear-btn"
                onClick={clearLayers}
                disabled={layers.length === 0}
              >
                Reset Protocol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerBuilder;
