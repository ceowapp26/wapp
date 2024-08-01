import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchValue: "test",
};

const searchsSlice = createSlice({
    name: 'searchs',
    initialState,
    reducers: {
        setSearchValue(state, action) {
            return {
                ...state,
                searchValue: action.payload,
            };
        },
    },
});

export const { setSearchValue } = searchsSlice.actions;

// Corrected selectSearchs selector
export const selectSearchs = (state) => state.searchs?.searchValue;

export default searchsSlice.reducer;
