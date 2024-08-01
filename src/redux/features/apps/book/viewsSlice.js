import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookId: '',
};

const viewsSlice = createSlice({
    name: 'views',
    initialState,
    reducers: {
        showBookPreview(state, action) {
            return {
                ...state,
                bookLink: action.payload,
            };
        }
    }
});

export const { showBookPreview } = viewsSlice.actions;
export const selectCurrentBook = (state) => state.views?.bookLink
export default viewsSlice.reducer;