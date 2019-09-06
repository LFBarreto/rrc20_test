export const FETCH_ADDRESS = 'wallets/address/fetch';
export const FETCH_ADDRESS_BALANCE = 'wallets/address/balance';
export const FETCH_ADDRESS_BALANCE_SUCCESS = 'wallets/address/balance/success';
export const FETCH_ADDRESS_BALANCE_FAIL = 'wallets/address/balance/fail';
export const FETCH_ADDRESS_BLOCK = 'wallets/address/fetch/block';
export const FETCH_NEXT_ADDRESS_BLOCK = 'wallets/address/fetch/next-block';
export const FETCH_ADDRESS_SUCCESS = 'wallets/address/fetch/success';
export const FETCH_ADDRESS_FAIL = 'wallets/address/fetch/fail';
export const SET_ACCOUNT_TXS = 'wallets/acount/txs';

export const FETCH_COUNTER_VALUES = 'wallets/counter-values/fetch';
export const FETCH_COUNTER_VALUES_SUCCESS = 'wallets/counter-values/success';
export const FETCH_COUNTER_VALUES_FAIL = 'wallets/counter-values/fail';


export default {
	fetchAddress: (address: String): Action => ({
        type: FETCH_ADDRESS,
        payload: address,
    }),
    fetchAddressBalance: (address: String): Action => ({
        type: FETCH_ADDRESS_BALANCE,
        payload: address,
    }),
    fetchAddressBalanceSuccess: (response: BalanceResponse): Action => ({
        type: FETCH_ADDRESS_BALANCE_SUCCESS,
        payload: response,
    }),
    fetchAddressBalanceFail: (payload): Action => ({
        type: FETCH_ADDRESS_BALANCE_FAIL,
        payload,
    }),
    fetchAddressBlock: (address: String, block?: String) => ({
        type: FETCH_ADDRESS_BLOCK,
        payload: { address, block }
    }),
    fetchNextAddressBlock: (address: String, response: TokensResponse) => ({
        type: FETCH_NEXT_ADDRESS_BLOCK,
        payload: { address, response }
    }),
    fetchAddressSuccess: (address: String, response: TokensResponse): Action => ({
        type: FETCH_ADDRESS_SUCCESS,
        payload: { address, response },
    }),
    fetchAddressFail: (payload): Action => ({
        type: FETCH_ADDRESS_FAIL,
        payload,
    }),
    setAccountTxs: (address: String, txs: Array<Object>, truncated: Boolean, tokens: Object): Action =>({
        type: SET_ACCOUNT_TXS,
        payload: ({ address, txs, truncated, tokens })
    }),
    fetchCounterValues: (tokens: Object): Action => ({
        type: FETCH_COUNTER_VALUES,
        payload: tokens
    }),
    fetchCounterValuesSuccess: (counterValues: CouterValuesResponse): Action => ({
        type: FETCH_COUNTER_VALUES_SUCCESS,
        payload: counterValues
    }),
    fetchCounterValuesFail: (payload): Action => ({
        type: FETCH_COUNTER_VALUES_FAIL,
        payload
    }),
};