import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myfavorite: [],
  readingnow: [],
  toread: [],
  haveread: []
};

const libraryBooksSlice = createSlice({
  name: 'libraries',
  initialState,
  reducers: {
    addToLists(state, { payload }) {
      const { category, id } = payload;
      state[category].push(id);

    },
    removeFromLists(state, { payload }) {
      const { category, id } = payload;
      state[category] = state[category].filter(bookId => bookId !== id);
    },
  },
});

export const { addToLists, removeFromLists } = libraryBooksSlice.actions;
export const selectLibraryBooks = (state) => state.libraries;
export default libraryBooksSlice.reducer;


