import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IngredientCard from './IngredientCard';
import type { Ingredient } from '../../types';

describe('SupplementCard (IngredientCard)', () => {
  const mockSupplement: Ingredient = {
    id: 1,
    name: "Lion's Mane",
    category: 'focus',
    price: 1.10,
    imageUrl: null,
  };

  const mockOnAdd = vi.fn();

  it('renders supplement name', () => {
    render(<IngredientCard ingredient={mockSupplement} onAdd={mockOnAdd} />);
    expect(screen.getByText("Lion's Mane")).toBeInTheDocument();
  });

  it('renders price with 2 decimal places', () => {
    render(<IngredientCard ingredient={mockSupplement} onAdd={mockOnAdd} />);
    expect(screen.getByText('$1.10 / serving')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<IngredientCard ingredient={mockSupplement} onAdd={mockOnAdd} />);
    expect(screen.getByText('focus')).toBeInTheDocument();
  });

  it('calls onAdd with ingredient id when add button clicked', async () => {
    const user = userEvent.setup();
    render(<IngredientCard ingredient={mockSupplement} onAdd={mockOnAdd} />);
    await user.click(screen.getByText('+'));
    expect(mockOnAdd).toHaveBeenCalledWith(mockSupplement.id);
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onAdd when card is clicked', async () => {
    const user = userEvent.setup();
    render(<IngredientCard ingredient={mockSupplement} onAdd={mockOnAdd} />);
    const card = screen.getByText("Lion's Mane").closest('.ingredient-card');
    await user.click(card!);
    expect(mockOnAdd).toHaveBeenCalledWith(mockSupplement.id);
  });

  it('formats whole number price correctly', () => {
    const wholePrice = { ...mockSupplement, price: 2 };
    render(<IngredientCard ingredient={wholePrice} onAdd={mockOnAdd} />);
    expect(screen.getByText('$2.00 / serving')).toBeInTheDocument();
  });
});
