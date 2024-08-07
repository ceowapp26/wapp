import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialCoverPosition: 0,
    newCoverPosition: 0,
};

const coversSlice = createSlice({
    name: 'wapp_doc_covers',
    initialState,
    reducers: {
        setInitialCoverPosition: (state, action) => {
          state.initialCoverPosition = action.payload 
        },
        setNewCoverPosition: (state, action) => {
          state.newCoverPosition = action.payload 
        },
    }
});

export const { setInitialCoverPosition, setNewCoverPosition } = coversSlice.actions;

export const selectInitialCoverPosition = createSelector((state) => state.wapp_doc_covers, (covers) => {
    return covers.initialCoverPosition;
});
export const selectNewCoverPosition = createSelector((state) => state.wapp_doc_covers, (covers) => {
    return covers.newCoverPosition;
});

export default coversSlice.reducer;
