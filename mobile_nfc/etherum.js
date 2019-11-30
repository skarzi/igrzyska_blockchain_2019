import {ethers, Wallet, utils} from 'ethers';
import NfcManager, {NfcEvents, Ndef, NfcTech} from 'react-native-nfc-manager';
import {Buffer} from 'buffer';

let provider = new ethers.providers.InfuraProvider(
  'rinkeby',
  '3a9abab20b084eeeb1cca97e1d83fe41',
);
// 0xcC80A6CfAF94E3597bC131e8bd62e885934F3ab7
let wallet = new Wallet(
  '0x7c67889e52f7ff44148673ce5c03e57c76dad62ceb5d5e04f835feb9ce965caf',
  provider,
);
// 0x560009BDe5c32cc776F0d560e98DFB4034932161
let wallet2 = new Wallet(
  '0x22eeaf5bd630a516991e57916dfb8b1b1e5ee30ebed3e4747dc6849626565a92',
  provider,
);

function timems() {
  return new Date().getTime();
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

async function verifySignature(msg, timeout, resolve, reject) {
  try {
    let tag = await NfcManager.getNdefMessage();
    if (tag.ndefMessage.length < 3) {
      if (timeout < timems()) {
        throw new Error('timeout');
      }
      return setTimeout(verifySignature, 100, msg, timeout, resolve, reject);
    }

    tag.ndefMessage[0].payload.shift();
    tag.ndefMessage[1].payload.shift();
    tag.ndefMessage[2].payload.shift();
    let owner = Buffer.from(tag.ndefMessage[0].payload);
    let pubkeyb = Buffer.from(tag.ndefMessage[1].payload);
    let signature = Buffer.from(tag.ndefMessage[2].payload);

    NfcManager.cancelTechnologyRequest();
    resolve({
      msg: msg,
      owner: owner,
      pubkeyb: pubkeyb,
      signature: signature,
      timeleft: timeout - timems(),
    });
  } catch (e) {
    NfcManager.cancelTechnologyRequest();
    reject(e.message);
  }
}

function sign(msg) {
  return new Promise(async (resolve, reject) => {
    try {
      let device = await NfcManager.requestTechnology(NfcTech.Ndef);
      let packet = Ndef.encodeMessage([Ndef.uriRecord(msg)]);
      let write = await NfcManager.writeNdefMessage(packet);
      console.log('sign now', msg);
      verifySignature(msg, timems() + 10000, resolve, reject);
    } catch (e) {
      NfcManager.cancelTechnologyRequest();
      reject(e.message);
    }
  });
}

export default async function initKey() {
  await NfcManager.start();
  let balance = await provider.getBalance(wallet.address);
  let transactions = await wallet.getTransactionCount();
  const transaction = {
    nonce: transactions,
    gasLimit: 22000,
    gasPrice: utils.bigNumberify('20000000000'),
    to: '0x560009BDe5c32cc776F0d560e98DFB4034932161',
    value: utils.parseEther('0.05'),
    data: '0x',
    // This ensures the transaction cannot be replayed on different networks
    chainId: ethers.utils.getNetwork('rinkeby').chainId,
  };
  let serialized = utils.serializeTransaction(transaction);
  let hash = utils.keccak256(serialized).substr(2);
  console.log(hash);
  let nfcmsg = await sign(hash);
  console.log(nfcmsg);

  const r = "0x" + buf2hex(nfcmsg.signature.slice(0, 32));
  const s = "0x" + buf2hex(nfcmsg.signature.slice(32));
  console.log(r);
  console.log(s);
  let serialized2 = utils.serializeTransaction(
    transaction,
    utils.joinSignature({
      r: r,
      s: s,
      recoveryParam: 0,
      v: 27,
    }),
  );
  console.log(serialized2);
  console.log(utils.parseTransaction(serialized2));

  let orgsig = wallet.signingKey.signDigest("0x" + hash);
  let serialized3 = utils.serializeTransaction(transaction, orgsig);
  console.log(serialized3);
  console.log(utils.parseTransaction(serialized3));
  console.log(wallet.sign(transaction));
  return balance;
}
