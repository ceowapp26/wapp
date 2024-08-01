import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface DocumentsState {
    items: Doc<"documents">[];
}

const initialState: DocumentsState = {
    items: [],
};

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<Doc<"documents">[]>) => {
            state.items = action.payload;
        },
    }
});

export const { setItems } = documentsSlice.actions;

export const selectItems = (state: RootState) => state.documents.items;

export default documentsSlice.reducer;
