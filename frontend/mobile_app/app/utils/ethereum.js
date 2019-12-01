import NfcManager, {NfcEvents, Ndef, NfcTech} from 'react-native-nfc-manager';
import {Buffer} from 'buffer';

function timems() {
  return new Date().getTime();
}

function buf2hex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
    .join('');
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
    let signature_raw = Buffer.from(tag.ndefMessage[2].payload);

    const r = '0x' + buf2hex(signature_raw.slice(0, 32));
    const s = '0x' + buf2hex(signature_raw.slice(32));
    let signature = {
      r: r,
      s: s,
      recoveryParam: 0,
      v: 27,
    };

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

function sign(password, msg) {
  return new Promise(async (resolve, reject) => {
    let timeout = timems() + 10000;
    try {
      let device = await NfcManager.requestTechnology(NfcTech.Ndef);
      if (password !== 'test123') {
        // not finished yet
        reject('Invalid password');
      }
      let packet = Ndef.encodeMessage([Ndef.uriRecord(msg)]);
      let write = await NfcManager.writeNdefMessage(packet);
      verifySignature(msg, timeout, resolve, reject);
    } catch (e) {
      NfcManager.cancelTechnologyRequest();
      reject(e.message);
    }
  });
}

export default async function nfcSign(password, hash) {
  if (typeof hash !== 'string') {
    throw Error('String with nfc card password is expected as first argument');
  }
  if (typeof hash !== 'string' || hash.length !== 64) {
    throw Error('String with hex of hash with size of 64 is expected');
  }
  await NfcManager.start();
  return await sign(password, hash);
}
