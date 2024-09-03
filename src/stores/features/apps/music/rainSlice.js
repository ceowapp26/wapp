import { createSelector, createSlice } from "@reduxjs/toolkit";

const rainSlice = createSlice({
  name: "wapp_music_rain",
  initialState: {
    rainMode: "clear",
    rainValue: 0,
  },

  reducers: {
    setRain: (state, action) => {
      state.rainMode = action.payload.rainMode;
      state.rainValue = action.payload.rainValue;
    },
    changeRainStatus: (state, action) => {
      const { currentStatus, value } = action.payload;
      let rainStatus;
      if (currentStatus === "rain") rainStatus = "clear";
      else if (currentStatus === "clear") rainStatus = "rain";

      state.rainMode = rainStatus;
      state.rainValue = value;
    },
  },
});

export const { setRain, changeRainStatus } = rainSlice.actions;
export const selectRainStatus = createSelector((state) => state.wapp_music_rain, (rain) => {
    return rain.rainValue;
});

export default rainSlice.reducer;
