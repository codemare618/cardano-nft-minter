const Cardano = require('cardanocli-js');

const era = process.env.CARDANO_ERA;
const testnetOptions = {
    shelleyGenesisPath:'testnet-shelley-genesis.json',
    network: 'testnet-magic 1097911063',
    era,
}

const mainNetOptions = {
    shelleyGenesisPath:'mainnet-shelley-genesis.json',
    network: 'mainnet',
    era,
}

const options = process.env.CARDANO_TESTNET ? testnetOptions : mainNetOptions;

const cardano = new Cardano(options);

// new workaround funcition to get the minimum lovelace required if lovelace is 0
cardano.transactionBuildLoveLace = function(tx) {
    let raw = cardano.transactionBuild(tx);
    if (raw.lovelace) {
        // assign again and then build transaction again
        tx.txOut[0].value.lovelace = raw.lovelace;
        raw = cardano.transactionBuild(tx);
    }
    return raw;
}

module.exports = cardano;
