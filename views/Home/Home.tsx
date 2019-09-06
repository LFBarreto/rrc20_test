import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { ledgerEthUtils, startAndEndString } from '../../utils';
import walletsActions from '../../store/actions/wallets';

const renderAddressItem = (onPress: Function) => ({item, index, separators}) => (
    <TouchableHighlight
      key={index}
      style={styles.listItem}
      onPress={() => onPress(item)}
      underlayColor="#81b9bf"
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <Text key={item} style={styles.listItemText}>{startAndEndString(item)}</Text>
    </TouchableHighlight>
  )

const validateEthKey= (value) => {
    const val = value.replace('0x', '')
    return ledgerEthUtils.isValidEthereum(val)
    ? undefined
    : 'This is not a valid ETH address'
}

function Home({ addresses, fetchAddress, navigation: { navigate } }) {
    const [error, onChangeError] = useState(undefined);
    const [value, onChangeAddress] = useState('');

    const submit = () => {
        const errors = validateEthKey(value);
        if (errors) onChangeError(errors);
        else onSuccess(value)
    }

    const onSuccess = (address) => {
        fetchAddress(address);
        navigate('AccountPage', { address: startAndEndString(address) });
    }

    const history = addresses && addresses.length 
    ? <>
        <Text style={[styles.title, styles.history]}>History</Text>
            <FlatList
                style={styles.list}
                data={addresses}
                renderItem={renderAddressItem(onSuccess)}
            />
    </> : null

    return (
        <View style={styles.container}>
            <Text style={styles.title} >Open an Ethereum account</Text>
            <TextInput
                style={styles.textInput}
                value={value}
                textContentType="password"
                onChangeText={onChangeAddress}
                onBlur={submit}
                placeholder="Ethereum address..."
                autoCompleteType="off"
                autoCorrect={false}
                clearButtonMode="while-editing"
                maxLength={42}
            />
            <Text style={styles.error}>{ error }</Text>
            { history }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
    },
    list: {
        width: '100%',
    },
    listItem: {
        width: '100%',
        height: 40,
        borderRadius: 40,
        marginTop: 5,
    },
    listItemText: {
        width: '100%',
        height: 40,
        fontSize: 16,
        lineHeight: 40,
        textAlign: 'left',
        backgroundColor: '#fafafa',
        color: '#00363a',
        fontWeight: 'bold',
        borderRadius: 40,
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        width: '100%',
        fontSize: 22,
        textAlign: 'left',
        margin: 10,
        color: '#00363a',
        paddingRight: 10,
        paddingLeft: 10,
    },
    history: {
        marginTop: 30
    },
    error: {
        width: '100%',
        fontSize: 16,
        textAlign: 'left',
        margin: 10,
        color: '#a00',
        paddingRight: 10,
        paddingLeft: 10,
    },
    textInput: {
        width: '100%',
        height: 50,
        backgroundColor: '#fafafa',
        color: '#00363a',
        borderRadius: 50,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 16,
    }
});

const mapStateToProps = (state) => ({
    addresses: state.wallets.history,
});
const mapDispatchToProps = dispatch => ({
    fetchAddress: (value) => dispatch(walletsActions.fetchAddress(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
