import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from '@/stores/utils/storage';
import booksReducer from '@/stores/features/apps/book/booksSlice';
import libraryBooksReducer from "@/stores/features/apps/book/libraryBooksSlice";
import searchsReducer from "@/stores/features/apps/book/searchsSlice";
import viewsReducer from "@/stores/features/apps/book/viewsSlice";
import rainReducer from '@/stores/features/apps/music/rainSlice';
import moodReducer from '@/stores/features/apps/music/moodSlice';
import changeVolumeReducer from '@/stores/features/apps/music/changeVolumeSlice';
import songsReducer from '@/stores/features/apps/music/songsSlice';
import playmodeReducer from '@/stores/features/apps/music/playmodeSlice';
import deezersongsReducer from '@/stores/features/apps/music/deezerSongsSlice';
import favoritesReducer from '@/stores/features/apps/music/favoritesSlice';
import coversReducer from '@/stores/features/apps/document/coversSlice';
import appReducer from '@/stores/features/apps/appsSlice';
import portalReducer from '@/stores/features/apps/portal/portalsSlice';

const persistConfigApp = {
  key: 'wapp_apps',
  storage,
};

const persistConfigPortal = {
  key: 'wapp_portals',
  storage,
};

const persistConfigBook = {
  key: 'wapp_book',
  storage,
};

const persistConfigMusic = {
  key: 'wapp_music',
  storage,
};

const persistConfigDocument = {
  key: 'wapp_doc',
  storage,
};

const persistedBookReducer = persistReducer(persistConfigBook, libraryBooksReducer);
const persistedMusicReducer = persistReducer(persistConfigMusic, favoritesReducer);
const persistedAppReducer = persistReducer(persistConfigApp, appReducer);
const persistedCoverReducer = persistReducer(persistConfigDocument, coversReducer);
const persistedPortalReducer = persistReducer(persistConfigPortal, portalReducer);

export const store = configureStore({
  reducer: {
    wapp_apps: persistedAppReducer,
    wapp_portals: persistedPortalReducer,
    wapp_doc_covers: persistedCoverReducer,
    wapp_book: booksReducer,
    wapp_book_searchs: searchsReducer,
    wapp_book_views: viewsReducer,
    wapp_book_libraries: persistedBookReducer,
    wapp_music_rain: rainReducer,
    wapp_music_mood: moodReducer,
    wapp_music_volume: changeVolumeReducer,
    wapp_music_songs: songsReducer,
    wapp_music_playmode: playmodeReducer,
    wapp_music_deezers: deezersongsReducer,
    wapp_music_favorites: persistedMusicReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
