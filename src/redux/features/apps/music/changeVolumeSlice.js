import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    volumeValue: 50,
};

const changeVolumeSlice = createSlice({
    name: 'volume',
    initialState,
    reducers: {
        changeVolume: (state, action) => {
            state.volumeValue = action.payload;
        }
    }
});

export const {changeVolume} = changeVolumeSlice.actions;
export const selectVolumeValues = createSelector((state) => state.volume, (volume) => {
    return volume.volumeValue;
});

export default changeVolumeSlice.reducer;


