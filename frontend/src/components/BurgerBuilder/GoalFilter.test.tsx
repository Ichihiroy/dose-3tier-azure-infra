import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GoalFilter from './GoalFilter';

describe('GoalFilter', () => {
  const onSelect = vi.fn();

  it('renders all filter pills', () => {
    render(<GoalFilter selected="all" onSelect={onSelect} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Focus')).toBeInTheDocument();
    expect(screen.getByText('Immunity')).toBeInTheDocument();
    expect(screen.getByText('Longevity')).toBeInTheDocument();
  });

  it('marks selected pill as active', () => {
    render(<GoalFilter selected="focus" onSelect={onSelect} />);
    const focusPill = screen.getByText('Focus').closest('button');
    expect(focusPill).toHaveClass('active');
  });

  it('calls onSelect with category when pill clicked', async () => {
    const user = userEvent.setup();
    render(<GoalFilter selected="all" onSelect={onSelect} />);
    await user.click(screen.getByText('Energy'));
    expect(onSelect).toHaveBeenCalledWith('energy');
  });

  it('calls onSelect with "all" when All pill clicked', async () => {
    const user = userEvent.setup();
    render(<GoalFilter selected="energy" onSelect={onSelect} />);
    await user.click(screen.getByText('All'));
    expect(onSelect).toHaveBeenCalledWith('all');
  });
});
