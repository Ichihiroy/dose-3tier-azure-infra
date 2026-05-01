import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StarterProtocols from './StarterProtocols';
import type { Ingredient } from '../../types';

const mockIngredients: Ingredient[] = [
  { id: 1, name: 'Ashwagandha',  category: 'energy',    price: 0.89, imageUrl: null },
  { id: 2, name: "Lion's Mane",  category: 'focus',     price: 1.10, imageUrl: null },
  { id: 3, name: 'NMN',          category: 'longevity', price: 2.50, imageUrl: null },
  { id: 4, name: 'Omega-3',      category: 'longevity', price: 0.70, imageUrl: null },
];

describe('StarterProtocols', () => {
  it('renders three preset buttons', () => {
    const onLoad = vi.fn();
    render(<StarterProtocols ingredients={mockIngredients} onLoad={onLoad} />);
    expect(screen.getByText('The Executive')).toBeInTheDocument();
    expect(screen.getByText('The Athlete')).toBeInTheDocument();
    expect(screen.getByText('The Focalist')).toBeInTheDocument();
  });

  it('calls onLoad with matching ingredient ids when preset clicked', async () => {
    const user = userEvent.setup();
    const onLoad = vi.fn();
    render(<StarterProtocols ingredients={mockIngredients} onLoad={onLoad} />);
    await user.click(screen.getByText('The Executive'));
    expect(onLoad).toHaveBeenCalledWith(expect.arrayContaining([1]));
  });
});
