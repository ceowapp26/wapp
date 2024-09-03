import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Portal {
  portalContext: string;
}

interface PortalsState {
  portalContext: string;
}

const initialState: PortalsState = {
  portalContext: ""
};

const portalsSlice = createSlice({
  name: 'wapp_portals',
  initialState,
  reducers: {
    setPortalContext: (state, action: PayloadAction<string>) => {
      state.portalContext = action.payload;
    },
    resetPortalContext: (state) => {
      state.portalContext = initialState.portalContext;
    },
  },
});

export const { setPortalContext, resetPortalContext } = portalsSlice.actions;

export const selectPortalContext = (state: { wapp_portals: PortalsState }) => state.wapp_portals.portalContext;

export default portalsSlice.reducer;
