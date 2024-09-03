import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: 'list',
};

const playmodeSlice = createSlice({
  name: 'wapp_music_playmode',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload 
    },
  },
});

export const { setMode } = playmodeSlice.actions;
export const selectPlayModeStatus = createSelector((state) => state.wapp_music_playmode, (mode) => {
    return mode.mode;
});

export default playmodeSlice.reducer;


