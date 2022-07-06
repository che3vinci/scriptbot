import React, { Profiler, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Counter from './Counter';

describe('test cases', () => {
  it('test tsx ', async () => {
    const { getByTestId } = render(<Counter />);

    expect(getByTestId('count')?.textContent).toBe('0');
    fireEvent.click(screen.getByText('click'));
    await waitFor(() => {
      screen.getByTestId('count').textContent === '1';
    });
  });
});
