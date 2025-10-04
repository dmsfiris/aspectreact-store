/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
// src/__tests__/checkout.test.jsx
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from '../component/Checkout';

// Mock the cart & auth hooks used by Checkout
jest.mock('react-use-cart', () => ({
  useCart: () => ({
    items: [{ id: 1, name: 'Test Product', price: 10, quantity: 2 }],
    cartTotal: 20,
    isEmpty: false,
    emptyCart: jest.fn(),
  }),
}));
jest.mock('../lib/auth', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}));

function renderUI() {
  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  );
}

test('submit button is disabled initially and enables when form is valid and terms agreed', async () => {
  const user = userEvent.setup();
  renderUI();

  const submit = screen.getByRole('button', { name: /place order/i });
  expect(submit).toBeDisabled();

  // Fill required fields
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');
  await user.type(screen.getByLabelText(/address line 1/i), '123 Demo St');
  await user.type(screen.getByLabelText(/^city$/i), 'Athens');
  await user.type(screen.getByLabelText(/zip/i), '12345');
  await user.selectOptions(screen.getByLabelText(/country/i), 'GR');

  // Terms & conditions
  await user.click(screen.getByLabelText(/i agree to the terms/i));

  expect(submit).toBeEnabled();
});
