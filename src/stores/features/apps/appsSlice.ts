import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface App {
  appName: string;
  url: string;
  logo: string;
  portalContext: string;
}

interface AppsState {
  apps: Record<string, App>;
}

const initialState: AppsState = {
  apps: {
    "wapp-doc": {
      appName: "wapp-doc",
      url: "/myspace/apps/document",
      logo: "/global/company_logos/wapp-logo.png",
    },
  },
};

const appsSlice = createSlice({
  name: 'wapp_apps',
  initialState,
  reducers: {
    addToLists: (state, action: PayloadAction<App>) => {
      const { appName, url, logo } = action.payload;
      if (url && url.trim() !== "") {
        state.apps = {
          ...state.apps,
          [appName]: { appName, url, logo }
        };
      }
    },
    removeFromLists: (state, action: PayloadAction<{ appName: string }>) => {
      const { appName } = action.payload;
      const newApps = { ...state.apps };
      delete newApps[appName];
      state.apps = newApps;
    },
    reset: () => initialState,
  },
});

export const { addToLists, removeFromLists, reset } = appsSlice.actions;

export const selectApps = (state: { apps: AppsState }) => state.wapp_apps.apps;

export default appsSlice.reducer;