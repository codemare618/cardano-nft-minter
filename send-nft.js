const cardano = require('./cardano');

const sender = cardano.wallet('NFTMinter');

function sendNFT(senderWallet, receiver, assets) {
    const abs = {};
    assets.forEach((asset) => {
        abs[asset] = 1;
    });
    console.log(abs);
    const txInfo = {
        txIn: cardano.queryUtxo(senderWallet.paymentAddr),
        txOut:[
            {
                address: senderWallet.paymentAddr,
                value: {
                    lovelace: sender.balance().value.lovelace - cardano.toLovelace(1.5 * assets.length)
                }
            },
            {
                address: receiver,
                value: {
                    lovelace : cardano.toLovelace(1.5 * assets.length),
                    ...abs
                }
            }
        ]
    }

    // 3. build the transaction

    const raw = cardano.transactionBuildRaw(txInfo)

// 4. calculate the fee

    const fee = cardano.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1
    })

// 5. pay the fee by subtracting it from the sender utxo

    txInfo.txOut[0].value.lovelace -= fee

    console.log(fee);

// 6. build the final transaction

    const tx = cardano.transactionBuildRaw({ ...txInfo, fee })

// 7. sign the transaction

    const txSigned = cardano.transactionSign({
        txBody: tx,
        signingKeys: [sender.payment.skey]
    })

// 8. submit the transaction

    const txHash = cardano.transactionSubmit(txSigned);
    return txHash;
}

module.exports = sendNFT;
