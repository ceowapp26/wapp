import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeEntity: 0,
    totalEntity: 6,
    subjectEntity: null,
};

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        initializeLists(state, action) {
            const { payload } = action;
            return {
                ...state,
                activeEntity: payload.startIndex,
                totalEntity: payload.totalIndex,
                subjectEntity: payload.subject
            };
        },
        nextBookLists(state) {
            const { activeEntity, subjectEntity, totalEntity} = state;
            state.activeEntity = activeEntity + 6;
        },

        prevBookLists(state) {
            const { activeEntity, subjectEntity, totalEntity } = state;
            state.activeEntity = activeEntity - 6;
        }

    }
});

export const { initializeLists, nextBookLists, prevBookLists } = booksSlice.actions;

export const selectCurrentBook = createSelector((state) => state.books, (books) => {
    return books.activeEntity;
});
export const selectTotalBook = createSelector((state) => state.books, (books) => {
    return books.totalEntity;
});

export default booksSlice.reducer;
