import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from "redux-persist";
import userReducer from './user/userSlice.js'
import storage from 'redux-persist/lib/storage';

//1. persistConfig will fetch details from localStorage
const persistConfig = {
    key: 'root',
    storage,
    version: 1
}

//2. combining all reducers
const rootReducer = combineReducers({ user: userReducer });

//3. creating persist reducer from reduc-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

//4. configuring store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

//5. configuring persistStore from reduc-persist
export const persistor=persistStore(store)