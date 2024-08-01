import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from '@/redux/utils/storage';
import booksReducer from '@/redux/features/apps/book/booksSlice';
import libraryBooksReducer from "@/redux/features/apps/book/libraryBooksSlice";
import searchsReducer from "@/redux/features/apps/book/searchsSlice";
import viewsReducer from "@/redux/features/apps/book/viewsSlice";
import rainReducer from '@/redux/features/apps/music/rainSlice';
import moodReducer from '@/redux/features/apps/music/moodSlice';
import changeVolumeReducer from '@/redux/features/apps/music/changeVolumeSlice';
import songsReducer from '@/redux/features/apps/music/songsSlice';
import playmodeReducer from '@/redux/features/apps/music/playmodeSlice';
import deezersongsReducer from '@/redux/features/apps/music/deezerSongsSlice';
import favoritesReducer from '@/redux/features/apps/music/favoritesSlice';
import coversReducer from '@/redux/features/apps/document/coversSlice';
import documentsReducer from '@/redux/features/apps/document/documentsSlice';
import appReducer from '@/redux/features/apps/appsSlice';

const persistConfigBooks = {
  key: 'books',
  storage,
};

const persistConfigApp = {
  key: 'apps',
  storage,
};

const persistConfigMusic = {
  key: 'musics',
  storage,
};

const persistConfigDocument = {
  key: 'documents',
  storage,
};

const persistedBookReducer = persistReducer(persistConfigBooks, libraryBooksReducer);
const persistedMusicReducer = persistReducer(persistConfigMusic, favoritesReducer);
const persistedAppReducer = persistReducer(persistConfigApp, appReducer);
const persistedCoverReducer = persistReducer(persistConfigDocument, coversReducer);
const persistedDocumentReducer = persistReducer(persistConfigDocument, documentsReducer);

export const store = configureStore({
  reducer: {
    books: booksReducer,
    searchs: searchsReducer,
    views: viewsReducer,
    libraries: persistedBookReducer,
    rain: rainReducer,
    mood: moodReducer,
    volume: changeVolumeReducer,
    apps: persistedAppReducer,
    songs: songsReducer,
    playmode: playmodeReducer,
    deezers: deezersongsReducer,
    favorites: persistedMusicReducer,
    documents: persistedDocumentReducer,
    covers: persistedCoverReducer
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
