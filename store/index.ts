import { createStore, applyMiddleware, compose } from 'redux';
import createReducer, { InitialState } from './reducers';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { persistStore } from 'redux-persist';

import ledgerEthUtils from '../utils/ledgerEthUtils';

import {
	WalletsEffects
} from './effects';

const epicMiddleware = createEpicMiddleware({ dependencies: {
	ledgerEthUtils
}});
// Create the store
const middlewares = [
	epicMiddleware,
];

const enhancers = [
	applyMiddleware(...middlewares)
];

const store = createStore(
	createReducer(),
	InitialState,
	compose(...enhancers),
);

const rootEffects = combineEpics(
	WalletsEffects
);
epicMiddleware.run(rootEffects);

export const persistor = persistStore(store);

export default store;
