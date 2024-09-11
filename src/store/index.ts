import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appReducer from './reducers/app'

const persistConfig = {
  key: 'quiz-app',
  storage,
  // whitelist: [''],
}

const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      app: appReducer,
    })
  ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
