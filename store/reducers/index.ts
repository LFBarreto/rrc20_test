import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import wallets, { initialStateWallets } from './wallets';

export const InitialState = {
    wallets: initialStateWallets,
};

const persistConfig = {
	version: 0.1,
	key: 'erc20history',
	storage: AsyncStorage,
	whitelist:['history'],
	serialize: true,
};
const persistedWallets = persistReducer(persistConfig, wallets);

export default function createReducer() {
	return combineReducers({
        wallets: persistedWallets,
	});
}
