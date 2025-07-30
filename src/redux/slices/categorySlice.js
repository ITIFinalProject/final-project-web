// src/store/slices/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    'Entertainment',
    'Educational & Business',
    'Cultural & Arts',
    'Sports & Fitness',
    'Technology & Innovation',
    'Travel & Adventure',
  ],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Optional: addCategory, removeCategory
    setCategories: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
