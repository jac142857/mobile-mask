"use strict";

exports.__esModule = true;
exports.transformReferencedTransactions = exports.transformOrigTransactions = exports.getOrigTransactions = exports.getReferencedTransactions = void 0;

var _utxoLib = require("@trezor/utxo-lib");

var _bufferUtils = require("../../../utils/bufferUtils");

var _pathUtils = require("../../../utils/pathUtils");

// local modules
_utxoLib.Transaction.USE_STRING_VALUES = true; // Get array of unique referenced transactions ids

var getReferencedTransactions = function getReferencedTransactions(inputs) {
  var result = [];
  inputs.forEach(function (input) {
    if (input.prev_hash && !result.includes(input.prev_hash)) {
      result.push(input.prev_hash);
    }
  });
  return result;
}; // Get array of unique original transactions ids (used in rbf)


exports.getReferencedTransactions = getReferencedTransactions;

var getOrigTransactions = function getOrigTransactions(inputs, outputs) {
  var result = [];
  inputs.forEach(function (input) {
    if (input.orig_hash && !result.includes(input.orig_hash)) {
      result.push(input.orig_hash);
    }
  });
  outputs.forEach(function (output) {
    if (output.orig_hash && !result.includes(output.orig_hash)) {
      result.push(output.orig_hash);
    }
  });
  return result;
}; // BitcoinJsTransaction returns input.witness as Buffer[]
// expected hex response format:
// chunks size + (chunk[i].size + chunk[i])
// TODO: this code should be implemented in BitcoinJsTransaction (@trezor/utxo-lib)


exports.getOrigTransactions = getOrigTransactions;

var getWitness = function getWitness(witness) {
  if (!Array.isArray(witness)) return;

  var getChunkSize = function getChunkSize(n) {
    var buf = Buffer.allocUnsafe(1);
    buf.writeUInt8(n);
    return buf;
  };

  var chunks = witness.reduce(function (arr, chunk) {
    return arr.concat([getChunkSize(chunk.length), chunk]);
  }, [getChunkSize(witness.length)]);
  return Buffer.concat(chunks).toString('hex');
}; // Find inputs used for current sign tx process related to referenced transaction
// related inputs and outputs needs more info (address_n, amount, script_type, witness)
// const findAddressN = (vinVout?: TxInputType[] | TxOutputType[], txid: string, index: number) => {
//     if (!vinVout) return;
//     const utxo = vinVout.find(o => o.orig_index === index && o.orig_hash === txid && o.address_n);
//     return utxo ? utxo.address_n : undefined;
// };
// Transform orig transactions from Blockbook (blockchain-link) to Trezor format


var transformOrigTransactions = function transformOrigTransactions(txs, coinInfo, addresses) {
  return txs.flatMap(function (raw) {
    if (coinInfo.type !== 'bitcoin' || raw.type !== 'blockbook' || !addresses) return [];
    var _raw$tx = raw.tx,
        hex = _raw$tx.hex,
        vin = _raw$tx.vin,
        vout = _raw$tx.vout;

    var tx = _utxoLib.Transaction.fromHex(hex, coinInfo.network);

    var inputAddresses = addresses.used.concat(addresses.change); // inputs, required by TXORIGINPUT (TxAckInput) request from Trezor

    var inputsMap = function inputsMap(input, i) {
      // TODO: is vin[i] a correct way? order in Bitcoinjs
      var address = vin[i].addresses.join(''); // controversial: is there a possibility to have more than 1 address in this tx? multisig?

      var inputAddress = inputAddresses.find(function (addr) {
        return addr.address === address;
      });
      var address_n = inputAddress ? (0, _pathUtils.getHDPath)(inputAddress.path) : []; // TODO: is fallback necessary?

      return {
        address_n: address_n,
        prev_hash: (0, _bufferUtils.reverseBuffer)(input.hash).toString('hex'),
        prev_index: input.index,
        script_sig: input.script.toString('hex'),
        sequence: input.sequence,
        script_type: (0, _pathUtils.getScriptType)(address_n),
        multisig: undefined,
        // TODO
        amount: vin[i].value,
        decred_tree: undefined,
        // TODO
        witness: tx.hasWitnesses() ? getWitness(input.witness) : undefined,
        ownership_proof: undefined,
        // TODO
        commitment_data: undefined // TODO

      };
    }; // outputs, required by TXORIGOUTPUT (TxAckOutput) request from Trezor


    var outputsMap = function outputsMap(output, i) {
      // TODO: is vout[i] a correct way? order in Bitcoinjs
      var address = vout[i].addresses.join(''); // controversial: is there a possibility to have more than 1 address in this tx? multisig?

      var changeAddress = addresses.change.find(function (addr) {
        return addr.address === address;
      });
      var address_n = changeAddress && (0, _pathUtils.getHDPath)(changeAddress.path);
      var amount = typeof output.value === 'number' ? output.value.toString() : output.value; // console.warn('OUT ADDR', BitcoinJSAddress.fromOutputScript(output.script, coinInfo.network), address);

      return address_n ? {
        address_n: address_n,
        amount: amount,
        script_type: (0, _pathUtils.getOutputScriptType)(address_n)
      } : {
        address: address,
        amount: amount,
        script_type: 'PAYTOADDRESS'
      };
    };

    var extraData = tx.getExtraData();
    var version_group_id = _utxoLib.coins.isZcashType(tx.network) && typeof tx.versionGroupId === 'number' && tx.version >= 3 ? tx.versionGroupId : undefined;
    return [{
      version: tx.isDashSpecialTransaction() ? tx.version | tx.type << 16 : tx.version,
      hash: tx.getId(),
      inputs: tx.ins.map(inputsMap),
      outputs: tx.outs.map(outputsMap),
      extra_data: extraData ? extraData.toString('hex') : undefined,
      lock_time: tx.locktime,
      timestamp: tx.timestamp,
      version_group_id: version_group_id,
      expiry: tx.expiryHeight
    }];
  });
}; // Transform referenced transactions from Blockbook (blockchain-link) to Trezor format


exports.transformOrigTransactions = transformOrigTransactions;

var transformReferencedTransactions = function transformReferencedTransactions(txs, coinInfo) {
  return txs.flatMap(function (raw) {
    if (coinInfo.type !== 'bitcoin' || raw.type !== 'blockbook') return [];
    var hex = raw.tx.hex;

    var tx = _utxoLib.Transaction.fromHex(hex, coinInfo.network); // inputs, required by TXINPUT (TxAckPrevInput) request from Trezor


    var inputsMap = function inputsMap(input, i) {
      return {
        prev_index: input.index,
        sequence: input.sequence,
        prev_hash: (0, _bufferUtils.reverseBuffer)(input.hash).toString('hex'),
        script_sig: input.script.toString('hex')
      };
    }; // map bin_outputs, required by TXOUTPUT (TxAckPrevOutput) request from Trezor


    var binOutputsMap = function binOutputsMap(output) {
      return {
        amount: typeof output.value === 'number' ? output.value.toString() : output.value,
        script_pubkey: output.script.toString('hex')
      };
    };

    var extraData = tx.getExtraData();
    var version_group_id = _utxoLib.coins.isZcashType(tx.network) && typeof tx.versionGroupId === 'number' && tx.version >= 3 ? tx.versionGroupId : undefined;
    return [{
      version: tx.isDashSpecialTransaction() ? tx.version | tx.type << 16 : tx.version,
      hash: tx.getId(),
      inputs: tx.ins.map(inputsMap),
      bin_outputs: tx.outs.map(binOutputsMap),
      extra_data: extraData ? extraData.toString('hex') : undefined,
      lock_time: tx.locktime,
      timestamp: tx.timestamp,
      version_group_id: version_group_id,
      expiry: tx.expiryHeight
    }];
  });
};

exports.transformReferencedTransactions = transformReferencedTransactions;