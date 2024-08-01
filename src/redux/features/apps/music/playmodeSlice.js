import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: 'list',
};

const playmodeSlice = createSlice({
  name: 'playmode',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.playmode = action.payload 
    },
  },
});

export const { setMode } = playmodeSlice.actions;
export const selectPlayModeStatus = createSelector((state) => state.playmode, (mode) => {
    return mode.mode;
});

export default playmodeSlice.reducer;


