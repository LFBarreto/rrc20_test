import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Animated } from 'react-native';
import { connect } from 'react-redux';
import { ledgerEthUtils } from '../../utils';
import walletsActions from '../../store/actions/wallets';
import moment from 'moment';
import Loading from '../Loading/Loading';

const ARROW_IMG = {
    OUT: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALGSURBVHic7dm/btNQFMfx3zFi4A1YWVlYQeqIEEiFAu+R2EhNnK1hI2IgTh+maVNKpSzwCKy8QwgsuSw5ENokx76+f5zofNf4Xh19JMe+CdCgskHRTz8OP8SeY7U7sQfgskHRN4QTgA4eP3t+79tkfBl7JqAhQP9wuOYgRQe6jcM1Aykq0GYcLj5SNCAZh4uLFAWoPA4XDyk4UHUcLg5SUCB7HC48UjCg+jhcWKQgQO5wuHBI3oHc43BhkLwC+cPh/CN5A/KPw/lF8gIUDofzh+QcKDwO5wfJKVA8HM49kjMgC5w5YKYAPdh+mbkC6D6Au+W2pYMnT1/Q18vxdYVZNpa42MQGJyF6RYam0oVkaApjjgDMy25uCCeufpmsDWSL86nTLn0bFHk2qYoEQ7kLpFpAIXC4WEjWQCFxuBhIVkAWOD/r4nChkSoD2eAYAyc4XJFnkwXoNQIgVQKyxRnl6eeKc4mddtsXS6RfpRdZIJUGahIOt0Q6gkekUkBNxOF8I4lANjhEycsQOJxPpK1AtjjDTuuqwhon+ULaCLRLONxpt32BhXH6xb0WaBdxuKKXnbtEugW0yzicS6T/gPYBh3OF9BfI8lF+2EQcruhl5wZ4gxpICWCPM8rTLxXWRGnUTcd1kJJ9xuHqICUGVP7At4M4nA2SAc2TIm8PYKhX4vqdxeGqIBlCf9RJ3ycAUAJp53G4MkiMA6w8xbYgzfYFh9uGtIoD3HgPWoM0I1rsFQ436qZjSpK3WEG6iQOseZNeQZoRLQ6HnXfX3qeN1PC4dbZE+r0OB9hwFivy9gALPNxnHG543DqDMY/W4QBbTvNFL/3hb6xmVeTZ902fOflndZ9TICEFElIgIQUSUiAhBRJSICEFElIgIQUSUiAhBRJSICEFElIgIQUSUiAhBRJSICEFElIgIQUSUiAhBRJSICEFElIgoT8WUhyXaTz5ZAAAAABJRU5ErkJggg==',
    IN: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALrSURBVHic7dxPahRBGIbxpya6cOfG6XGlZxA8g6toAgF1qQYE8SjGlQpidOVGcJF7KHoNExRyAOPrwmoY8me6ur/uqu7xe7Yppj5+ND1JdWbA8zzv/y2UHmC5StoFnjcse3UYwn6OeVK6VHqA5QJcFdxsWpNpnKRmpQeYeg5ozAGNOaAxBzTmgMYc0JgDGnNAYw5ozAGNOaAxBzTmgMYc0JgDGnNAYw5ozAGNOaAxBzTmgMYc0JgDGnNAYw5ozAGNJQNel24MOciYuiYtUtcmAc6lbcHXSnrSfaxpNJfuzOB7Jd1PWd8IOJe2Z/BOcBl4sc6IlbQ5g4/AlQBvUhBXAi7h1f8GF1hTxEraDPAhXigINlIQLwQ8B6+uRnxsH3scncarS0E8F3AFXl0A9tYB8SK8uibEM4AJeHWTR6yku6vw6lYhnncFqsUMk0WMeO+b8Jo6A3gUwsEf2A3wO/E1ArC3kB5ZBslZW7wAJ4JnhyF8Ov2zc++BXRAFL6eA2CcerHgXXkfESrrXJx40/B64TogRb79PPEj4S6TrPbGSHiauH7yh8CDxb+G2iIJZgNdjQBwSD1qcxkwRcYh73ulanQdOCXEJL+njbF3woMOB6hQQc+FBxxNpA+KDLvu1aS5t5cIDw5H+GBHn0tbs3xtGFjwwPhPpgLgxFGIJPOjhodIYEEvhQU9P5UoilsSDHh9rlkCMZ5fF8KDn58I5EVsc/ALD4MEA35lwFMLBXCL1ylhCTN5jLHjxtYdpIe0AbwUbiYOcCL4BtxuWfglwq83rAk9/hPA5ZX3bBv3ak7Y3+L4b8spb2mPYSiHmwIv7DF9uxFx4ca885ULMiRf3y9fQiLnx4p55GwqxBF7cN399I5bCi3uXqS/Eknhx/3JZEUvjxRnK1hVxDHhxjvKVPpKyNApASEccEx6MCBCaEceGByMDhIsRx4g32ubS1kL6WUnHlXS8kH6lfuzAi9WIjmdoIe3Eg1nP8zxvhP0FtYUUdCR3P9kAAAAASUVORK5CYII=',
};

const renderTransaction = ({ item: { date, symbol, type, value, counterValues }, index }) => {
    const formattedDate = moment(date).format('lll');
    const textStyle = type === 'IN' ? styles.listItemTextIn : styles.listItemTextOut;
    const prefix = type === 'IN' ? '+' : '-';
    return (
        <View key={index} style={[styles.listItem, styles.listTokenItem]}>
            <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: ARROW_IMG[type] }}
            />
            <Text style={styles.listItemDate}>{formattedDate}</Text>
            <View style={styles.listItemDetails}>
                <Text style={[styles.listItemText, styles.listItemTextBold, textStyle]} numberOfLines={1}>{prefix} {symbol} {value}</Text>
                <Text style={styles.listItemText} numberOfLines={1}>${counterValues.USD}</Text>
            </View>
        </View>
    )
}

const renderBalance = ({ item: { key, balance, counterValues }, index }) => {
    return (
        <View key={index} style={styles.listItem}>
            <Text style={[styles.listItemText, styles.listItemTextBold]} key={index}>
                {key} {balance}
            </Text>
            <Text style={styles.listItemText}>${counterValues.USD}</Text>
        </View>
    )
}

function AccountPage({ counterValues, account: { balance, txs, tokens } }) {
    const [fadeAnim] = useState(new Animated.Value(0))
    const formattedBalance = ledgerEthUtils.formatValue(balance);
    const ethBalance = {
        USD: counterValues.ETH.USD * formattedBalance,
        EUR: counterValues.ETH.EUR * formattedBalance,
    };
    const { balances = {}, magnitudes = {} } = tokens;
    const formattedBalances = Object.entries(balances)
        .map(([key, value]) => {
            const balance = ledgerEthUtils.formatValue(value, magnitudes[key]);
            const counter = counterValues[key] || { EUR: 0, USD: 0 };
            return {
                key,
                balance: balance.toFixed(3),
                counterValues: {
                    EUR: (counter.EUR * balance).toFixed(3),
                    USD: (counter.USD * balance).toFixed(3)
                }
            }
        });

    const formattedTxs = txs.map(({ symbol, value, magnitude, ...tx }) => {
        const counter = counterValues[symbol] || { EUR: 0, USD: 0 };
        const formatedValue = ledgerEthUtils.formatValue(value, magnitude)
        return {
            ...tx, symbol, value: formatedValue.toFixed(3), counterValues: {
                EUR: (counter.EUR * formatedValue).toFixed(3),
                USD: (counter.USD * formatedValue).toFixed(3)
            }
        }
    });

    useEffect(() => {
        if(formattedBalances.length) {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }
            ).start();
        }
    });

    const page = !formattedBalance ? <Loading /> : (
        <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
            <View style={styles.titleBlock}>
                <Text style={[styles.title, styles.mainTitle]}>ETH {formattedBalance.toFixed(3)}</Text>
                <Text style={[styles.title]}>${ethBalance.USD.toFixed(3)}</Text>
            </View>

            <View style={styles.listTokens}>
                <Text style={styles.subTitle}>Tokens ({formattedBalances.length})</Text>
                <FlatList
                    data={formattedBalances}
                    renderItem={renderBalance}
                />
            </View>
            <View style={styles.listTxs}>
                <Text style={styles.subTitle}>Transactions</Text>
                <FlatList
                    data={formattedTxs}
                    renderItem={renderTransaction}
                />
            </View>
        </Animated.View>
    );

    return page
}

AccountPage.navigationOptions = ({ navigation }) => {
    return {
        title: navigation.getParam('address'),
        headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowColor: '#fff',
            shadowOpacity: 0,
            shadowOffset: {
                height: 0,
            }
        },
        headerTintColor: '#102027',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 13,
        },
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
    },
    titleBlock: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        height: 80,
        marginBottom: 10,
    },
    title: {
        height: 15,
        width: '100%',
        fontSize: 13,
        textAlign: 'center',
        color: '#78909c',
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#78909c',
    },
    mainTitle: {
        height: 30,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#102027',
    },
    listTokens: {
        height: 195,
        marginBottom: 10,
    },
    listTxs: {
        flex: 4,
        marginTop: 10,
    },
    listTokenItem: {
        backgroundColor: '#fafafa',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        marginBottom: 5,
        backgroundColor: '#fafafa',
        borderRadius: 40,
        paddingLeft: 20,
        paddingRight: 20,
    },
    listItemDetails: {
        width: '50%',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 40,
    },
    listItemDate: {
        flex: 1,
        fontSize: 11,
        color: '#00363a',
        textAlign: 'left',
        paddingLeft: 20,
    },
    listItemText: {
        fontSize: 13,
        color: '#78909c',
        textAlign: 'left',
    },
    listItemTextBold: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
    },
    listItemTextIn: {
        color: '#00cbcc',
    },
    listItemTextOut: {
        color: '#80cbc4',
    }
});

const mapStateToProps = (state) => ({
    counterValues: state.wallets.counterValues,
    account: state.wallets[state.wallets.selectedAccount],
});
const mapDispatchToProps = dispatch => ({
    fetchAddress: (value) => dispatch(walletsActions.fetchAddress(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
