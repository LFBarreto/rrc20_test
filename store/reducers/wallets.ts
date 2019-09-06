
import Immutable from 'seamless-immutable';
import { SET_ACCOUNT_TXS, FETCH_ADDRESS, FETCH_ADDRESS_BALANCE_SUCCESS, FETCH_COUNTER_VALUES_SUCCESS } from '../actions/wallets';
export const initialStateWallets = {
    selectedAccount: null,
    history: [],
    counterValues: {
        ETH: {
            USD: 0,
            EUR: 0
        }
    },
}

const MAX_HISTORY_STACK = 5;

const initialStateAccount = {
    balance: 0,
    tokens: {},
    lastBlockHash: null,
    txs: [],
    loading: true,
}

export default function walletsReducer(state = initialStateWallets, action) {
    switch (action.type) {
        case FETCH_ADDRESS: {
            const newState = Immutable(state);
            const address = action.payload;
            const history = [].concat(newState.history);
            if (!history.includes(address)) {
                history.unshift(address);
            }
 
            return Immutable
                .setIn(newState, ['selectedAccount'], address)
                .setIn([address], initialStateAccount)
                .setIn(['history'], history.slice(0, MAX_HISTORY_STACK));
        }
        case FETCH_ADDRESS_BALANCE_SUCCESS: {
            const newState = Immutable(state);
            const { address, balance } = action.payload;
            return Immutable
                .setIn(newState, [address, 'balance'], balance);
        }
        case SET_ACCOUNT_TXS: {
            const newState = Immutable(state);
            const { address, txs, truncated, tokens } = action.payload;
            const lastHash = txs.length ? txs[0].hash : null
            return Immutable
                    .setIn(newState, [address, 'txs'], txs)
                    .setIn([address, 'lastBlockHash'], lastHash)
                    .setIn([address, 'tokens'], tokens)
                    .setIn([address, 'loading'], truncated);
        }
        case FETCH_COUNTER_VALUES_SUCCESS: {
            const newState = Immutable(state);
            const counterValuesResponse: {[key: string]: number} = action.payload;
            const counterValues = Object.entries(counterValuesResponse)
            .reduce((result, [key, value]) => ({ ...result, [key]: { 
                EUR: ((1 / value) * counterValuesResponse.EUR),
                USD: ((1 / value) * counterValuesResponse.USD),
            }}), {})
            return Immutable
                .setIn(newState, ['counterValues'], counterValues);
        }
        default:
            return state;
    }
}