import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  moodMode: 'chill',
};

const moodSlice = createSlice({
  name: 'wapp_music_mood',
  initialState,
  reducers: {
    changeMoodStatus: (state, action) => {
      state.moodMode = action.payload;
    },
  },
});

export const { changeMoodStatus } = moodSlice.actions;

// Corrected usage of createSelector
export const selectMoodStatus = createSelector(
  (state) => state.wapp_music_mood, // Input selector
  (mood) => mood.moodMode // Result selector
);

export default moodSlice.reducer;
