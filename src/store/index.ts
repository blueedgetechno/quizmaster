import { configureStore } from '@reduxjs/toolkit'

import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import appReducer from './reducers/app'

const currentStateVersion = 0

const persistConfig = {
  key: 'quiz-app',
  storage,
  version: currentStateVersion,
  migrate: (state: any) => {
    if (state) {
      const persistedVersion = state._persist.version

      if (persistedVersion !== currentStateVersion) {
        // Version mismatch, return undefined to trigger a reset
        return Promise.resolve(undefined)
      }
    }

    return Promise.resolve(state) // Continue if version matches
  },
}

const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      app: appReducer,
    })
  ),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
