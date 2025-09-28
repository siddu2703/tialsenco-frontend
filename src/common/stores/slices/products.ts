/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  currentPage: number;
  filter?: string;
}

const initialState: ProductState = {
  currentPage: 1,
  filter: '',
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateCurrentPage: (state, action: PayloadAction<{ number: number }>) => {
      state.currentPage = action.payload.number;
    },
    updateFilter: (state, action: PayloadAction<{ filter?: string }>) => {
      state.filter = action.payload.filter;
    },
  },
});

export const { updateCurrentPage, updateFilter } = productsSlice.actions;
