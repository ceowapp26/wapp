import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myfavorite: [],
  readingnow: [],
  toread: [],
  haveread: []
};

const libraryBooksSlice = createSlice({
  name: 'wapp_book_libraries',
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
export const selectLibraryBooks = (state) => state.wapp_book_libraries;
export default libraryBooksSlice.reducer;


