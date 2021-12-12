require('dotenv').config();
// Force assign node socket path
process.env.CARDANO_NODE_SOCKET_PATH = '/Volumes/Work/cardano/db/node.socket';

const cardano = require('./cardano');
const mintFunction = require('./mint-nft');
const sendNFT = require('./send-nft');

const hashes = [
    // "QmbgdMKQjwRseL4frWUZkNWUKBrdsmwSyYvn8ajEWKikmY",
    // "QmU53y2tLyEQWdCJ8fT6GizhjHPBndDxaoT1Ln8ToHa38u",
     // "QmRYApfEW6pxsGbn8T1a2nfrM8pjRsFsdHeWrJfSC2XzJB",
      //"QmUMwSE9PydyyjchUYZKjbjBjpfSnJUddyX4TgGZWsfuEY",
      //"QmPQRBRSEJdEnMtJXiShhzWuqjm75SXn5yGkr5Cg2kNshd",
     //"QmUsjzKH3wvHbFGprPSivEoqQJYtALUEkM6Je1STFwpa7Z",
     //"QmU5apWGnemdhtZfJBUh5gevMBX4kTjz3EVMRnMFwHFUub",
    //"Qmeusgw9Fwp7tPmavV9My6kWHxuvD87BJjFW4fjJLPgp6z",
    //"QmZo46wYvTH62KZqo9tZj1PU5fiQSMii9hpAAGTipvyZTg",
    "QmVFj1zr13SW2PydjdzDNEj4tnPdUnGnXhHzMeGT7XN6D3"
];


// Create wallet
const wallet = cardano.wallet("NFTMinter");
const name = `nft-policy-${new Date().getTime()}`;
const payment = cardano.addressKeyGen(name);
const policyWallet = cardano.wallet(name);

console.log('----- Current wallet balance ----');
console.log(cardano.queryUtxo(wallet.paymentAddr));

// return;
const walletAddr = 'addr_test1qpvn59ck46yzst4e0738hetzmc4478kguld8d8pvvll8gzkkfxufwnn7nvh230pkz0g0g8n6y432y7dyp4zl9hv25snq5hma33';
//
// Send NFT
 sendNFT(wallet, walletAddr, [
     '19bed6c46949e3e9f8986237c91dd884b6dfb54a51638ea7d9147843.Monkey',
     '53d3b3ac6c6b5269136389c42de263550be46ac183058d1b24825d79.Monkey',
     '60f9e4d060ff180c576190991da3a5aaf4fc2ed9b2489a1952870fee.Monkey',
     '9f5c9acd4c0e468fadbf8d6976098971979744b63e489ee20c49ee93.Monkey',
     'ca2036376cdd0a53fbd300a6eb0ceef808c2111968e2d0ccc3f9a163.Monkey',
     'd8ad43bef16077590e7dbc7daa33a661b742a5d0dd2b4eb414992f94.Monkey'
]);
return;


const txHashes = [];
hashes.forEach((hash, i) => {
    // create random policy wallet
    try {
        const {txHash, asset} = mintFunction(wallet, policyWallet, {
            nftName: "Monkey",
            name: `Monkey-${i}`,
            image: `ipfs://${hash}`,
            description: "Fancy Monkeys",
            type: 'image/png',
            src: `ipfs://${hash}`,
            authors: ['Anonymous', 'CodeMonkey']
        });
        //sendNFT(wallet, walletAddr, asset);
    }catch(error) {
        console.log('ERROR HAPPENED', error);
    }
});

console.log('---------------------hashes-----------------');
txHashes.forEach(console.log);
console.log('---------------------hashes end---------------');
