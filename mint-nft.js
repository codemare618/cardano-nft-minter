const cardano = require('./cardano');


const buildTransaction = (tx) => {
    const raw = cardano.transactionBuildRaw(tx)
    const fee = cardano.transactionCalculateMinFee({
        ...tx,
        txBody: raw
    })
    tx.txOut[0].value.lovelace -= fee
    return cardano.transactionBuildRaw({...tx, fee})
};

const signTransaction = (wallet, tx) => {
    return cardano.transactionSign({
        signingKeys: [wallet.payment.skey, policyWallet.payment.skey],
        txBody: tx
    })
};


// Mint file which is uploaded to ipfsHash
function mint(wallet, policyWallet, metadata) {
    const {slot} = cardano.queryTip();
    const slotInvalidAfter = slot + 10000;
    const policyScript = {
        type: "all",
        scripts: [
            {
                type: "before",
                slot: slotInvalidAfter,
            },
            {
                type: 'sig',
                keyHash: cardano.addressKeyHash(policyWallet.name)
            }
        ]
    }

    // Create POLICY_ID from this policy script
    const POLICY_ID = cardano.transactionPolicyid(policyScript);
    const {nftName, name, image, description, type, src, ...others} = metadata;
    const nftMetadata = {
        "721": {
            [POLICY_ID]: {
                [nftName] : {
                    ...others,
                    name,
                    image,
                    description,
                    src,
                    type,
                }
            }
        }
    }

    const ASSET_ID = `${POLICY_ID}.${nftName}`;
    // NFT token is identified by `POLICY_ID.NFTNAME`
    const {utxo, value} = wallet.balance();
    delete value.undefined;
    const tx = {
        txIn: utxo,
        txOut: [
            {
                address: wallet.paymentAddr,
                value: {
                    // put all the available value
                    //...value,
                    ...value,
                    [ASSET_ID]: 1
                },
            }
        ],
        changeAddress: wallet.paymentAddr,
        mint: [
            {
                quantity: 1,
                action: 'mint',
                asset: ASSET_ID,
                script: policyScript
            }
        ],
        invalidAfter: slotInvalidAfter,
        metadata: nftMetadata,

        // Required for calculate mininum fee
        witnessOverride: 2,
        witnessCount: 2,
    }

    let rawTxPath = buildTransaction(tx);
    const signedTxPath = cardano.transactionSign({
        signingKeys: [wallet.payment.skey, policyWallet.payment.skey],
        txBody: rawTxPath,
    });

    const txHash = cardano.transactionSubmit(signedTxPath);
    return {txHash, asset:ASSET_ID};
}

module.exports = mint;
