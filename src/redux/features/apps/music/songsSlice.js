import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  entities: [],
  activeEntity: null,
  loop: false,
  looponce: false,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    playSong(state, action) {
      const { payload } = action;
      return state = {
        ...state,
        entities: payload.entities,
        activeEntity: payload.activeEntity,
        loop: payload.loop,
        looponce: payload.looponce,
      };
    },
    playNextSong(state) {
      const { entities, activeEntity } = state;
      if (entities && entities.length) { 
        const isLastSong = entities.length - 1 <= activeEntity;
        if (isLastSong && !state.loop) {
          return state;
        }
        state.activeEntity = activeEntity + 1;
      }
    },

    playPreviousSong(state) {
      const { entities, activeEntity, loop } = state;

      if (state.activeEntity <= 0 && !state.loop) {
        return;
      }

      state.activeEntity = activeEntity - 1;
    },
    playLoopSong(state) {
      const { entities, activeEntity, loop } = state;
      if (entities.length - 1 <= activeEntity && state.loop) {
        state.activeEntity = 0;
        return;
      } else if (state.activeEntity <= 0 && !state.loop) {
        state.activeEntity = entities.length - 1;
        return;
      }
    },
    playLoopOnceSong(state) {
      state.looponce = true;
    },
  },
});

export const {
  playSong,
  playNextSong,
  playPreviousSong,
  playLoopSong,
  playLoopOnceSong,
} = songsSlice.actions;

export const selectCurrentSong = createSelector(
  (state) => state.songs,
  (songs) => songs.entities[songs.activeEntity] || {}
);

export const selectLoopOnceStatus = createSelector(
  (state) => state.songs,
  (songs) => songs.looponce
);

export const selectCurrentTracklist = createSelector(
  (state) => state.songs,
  (songs) => songs.entities
);

export const selectCurrentIndex = createSelector(
  (state) => state.songs,
  (songs) => songs.activeEntity
);

export default songsSlice.reducer;




