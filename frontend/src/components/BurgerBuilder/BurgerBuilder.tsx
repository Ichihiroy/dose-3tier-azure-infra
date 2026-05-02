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
  { id: 1,  name: 'Ashwagandha',        category: 'energy',    price: 0.89, imageUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=300&q=75' },
  { id: 2,  name: 'Rhodiola Rosea',     category: 'energy',    price: 1.20, imageUrl: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=300&q=75' },
  { id: 3,  name: 'CoQ10',              category: 'energy',    price: 1.50, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=75' },
  { id: 4,  name: 'B-Complex',          category: 'energy',    price: 0.75, imageUrl: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=300&q=75' },
  { id: 5,  name: 'Maca Root',          category: 'energy',    price: 0.95, imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=75' },
  { id: 6,  name: "Lion's Mane",        category: 'focus',     price: 1.10, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=75' },
  { id: 7,  name: 'L-Theanine',         category: 'focus',     price: 0.65, imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=75' },
  { id: 8,  name: 'Alpha-GPC',          category: 'focus',     price: 1.80, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=75' },
  { id: 9,  name: 'Bacopa Monnieri',    category: 'focus',     price: 0.90, imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=300&q=75' },
  { id: 10, name: 'Phosphatidylserine', category: 'focus',     price: 1.40, imageUrl: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=300&q=75' },
  { id: 11, name: 'Vitamin C',          category: 'immunity',  price: 0.30, imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=300&q=75' },
  { id: 12, name: 'Vitamin D3 + K2',    category: 'immunity',  price: 0.55, imageUrl: 'https://images.unsplash.com/photo-1534339480783-6816b5e9e0d8?w=300&q=75' },
  { id: 13, name: 'Zinc Picolinate',    category: 'immunity',  price: 0.45, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=75' },
  { id: 14, name: 'Elderberry',         category: 'immunity',  price: 0.80, imageUrl: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=300&q=75' },
  { id: 15, name: 'Quercetin',          category: 'immunity',  price: 1.00, imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&q=75' },
  { id: 16, name: 'NMN',               category: 'longevity', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=75' },
  { id: 17, name: 'Omega-3',           category: 'longevity', price: 0.70, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=75' },
  { id: 18, name: 'Resveratrol',       category: 'longevity', price: 1.60, imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=300&q=75' },
  { id: 19, name: 'Collagen Peptides', category: 'longevity', price: 1.20, imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=75' },
  { id: 20, name: 'Magnesium Glycinate', category: 'longevity', price: 0.60, imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=300&q=75' },
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

      {/* Hero */}
      <div className="bb-hero">
        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&q=80"
          alt=""
          className="bb-hero-img"
          aria-hidden="true"
        />
        <div className="bb-hero-overlay" />
        <div className="bb-hero-content">
          <p className="bb-hero-eyebrow">Science-backed supplements</p>
          <h1 className="bb-hero-title">Your Protocol,<br />Your Rules.</h1>
          <p className="bb-hero-desc">
            Build a monthly supplement stack from 20 clinically-studied compounds.
            Delivered to your door.
          </p>
        </div>
      </div>

      <div className="bb-layout">
        {/* Left: catalog */}
        <div className="bb-catalog">
          <div className="bb-catalog-header">
            <h2 className="bb-title">Protocol Studio</h2>
            <p className="bb-subtitle">Filter by goal, add to your stack</p>
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
