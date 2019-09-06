import {
    combineEpics,
    ofType,
} from 'redux-observable';
import {
    of,
    from
} from 'rxjs';
import {
    map,
    concatMap,
    catchError,
    switchMap,
    filter,
    throttleTime,
    take,
    tap,
} from 'rxjs/operators';
import walletsActions, { FETCH_ADDRESS, FETCH_ADDRESS_BLOCK, FETCH_ADDRESS_SUCCESS, FETCH_NEXT_ADDRESS_BLOCK, FETCH_ADDRESS_BALANCE, FETCH_COUNTER_VALUES } from '../actions/wallets';

const mapToPayload = map(({ payload }) => payload)

export const fetchAddressEpic = (actions$) =>
    actions$
        .pipe(
            ofType(FETCH_ADDRESS),
            mapToPayload,
            concatMap((address: String) => [
                walletsActions.fetchAddressBalance(address),
                walletsActions.fetchAddressBlock(address)
            ]),
        );

export const fetchAddressBalanceEpic = (actions$, state$, { ledgerEthUtils: { fetchAddressBalance }}) => 
            actions$
                .pipe(
                    ofType(FETCH_ADDRESS_BALANCE),
                    mapToPayload,
                    tap(c => console.log(c, 'e')),
                    switchMap((address: String) => from(fetchAddressBalance(address))
                        .pipe(
                            map((response: Array<BalanceResponse>) => response.find((r) => r.address === address)),
                            map((response: BalanceResponse) => walletsActions.fetchAddressBalanceSuccess(response)),
                            catchError((error) => of(walletsActions.fetchAddressBalanceFail(error)))
                        )
                    )
                )

export const fetchAddressBlockEpic = (actions$, state$, { ledgerEthUtils: { fetchTxsPage } }) =>
    actions$
        .pipe(
            ofType(FETCH_ADDRESS_BLOCK),
            mapToPayload,
            switchMap(({ address, block }) => from(fetchTxsPage(address, block))
                .pipe(
                    concatMap((response: TokensResponse) => {
                        return [
                            walletsActions.fetchAddressSuccess(address, response),
                            // walletsActions.fetchNextAddressBlock(address, response),
                        ];
                    }),
                    catchError((error) => of(walletsActions.fetchAddressFail(error)))
                )
            )
        );

export const fetchAddressSuccessEpic = (actions$, state$, { ledgerEthUtils: { txsToOperations, getSummary_example } }) =>
actions$
    .pipe(
        ofType(FETCH_ADDRESS_SUCCESS),
        // throttleTime(100),
        mapToPayload,
        map(({ address, response }) => {
            const txs = (txsToOperations(response.txs, address) || []).reverse().slice(0, 25);
            const tokens = getSummary_example(txs);
            return { address, txs, truncated: response.truncated, tokens}
        }),
        concatMap(({ address, txs, truncated, tokens}) => [
            walletsActions.setAccountTxs(address, txs, truncated, tokens),
            walletsActions.fetchCounterValues(tokens)
        ])
    );

export const fetchCounterValuesEpic = (actions$, state$, { ledgerEthUtils: { fetchCounterValues }}) =>
        actions$
            .pipe(
                ofType(FETCH_COUNTER_VALUES),
                mapToPayload,
                map(({ balances }) => Object.keys(balances || {})),
                switchMap(tokens => from(fetchCounterValues(tokens))
                    .pipe(
                        map((response: CouterValuesResponse) => walletsActions.fetchCounterValuesSuccess(response)),
                        catchError((error) => of(walletsActions.fetchCounterValuesFail(error)))
                    ),
                ),
            );

export const fetchNextAddressBlock = (actions$) =>
    actions$
        .pipe(
            ofType(FETCH_NEXT_ADDRESS_BLOCK),
            mapToPayload,
            filter(({ response: { truncated, txs }, address }) => {
                return address && truncated && txs.length
            }),
            map(({ response: { txs }, address }) => ({
                address,
                block: txs[txs.length - 1].block.hash
            })),
            map(({ address, block }) => walletsActions.fetchAddressBlock(address, block))
        );

export default combineEpics(
    fetchAddressEpic,
    fetchAddressBalanceEpic,
    fetchAddressBlockEpic,
    fetchNextAddressBlock,
    fetchAddressSuccessEpic,
    fetchCounterValuesEpic
);
