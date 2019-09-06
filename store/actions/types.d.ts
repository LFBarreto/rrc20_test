interface Action  {
    type: String,
    payload?: any,
}

interface Token {
    hash: String,
    status: number,
    received_at: String,
    nonce: String,
    value: number,
    gas: number,
    gas_price: number,
    from: String,
    to: String,
    gas_used: number,
    block: Object<{
        hash: String,
        height: number,
        time: String,
    }>
}

interface TokensResponse {
    truncated: Boolean,
    txs: Array<Token>,
}

interface BalanceResponse {
    address: String,
    balance: number,
}

interface CouterValuesResponse {
    [key: String]: number
}