"use strict";

exports.__esModule = true;
exports.addressParametersFromProto = exports.addressParametersToProto = exports.validateAddressParameters = void 0;

var _paramsValidator = require("../helpers/paramsValidator");

var _pathUtils = require("../../../utils/pathUtils");

var validateAddressParameters = function validateAddressParameters(addressParameters) {
  (0, _paramsValidator.validateParams)(addressParameters, [{
    name: 'addressType',
    type: 'number',
    obligatory: true
  }, {
    name: 'path',
    obligatory: true
  }, {
    name: 'stakingKeyHash',
    type: 'string'
  }]);
  (0, _pathUtils.validatePath)(addressParameters.path);

  if (addressParameters.stakingPath) {
    (0, _pathUtils.validatePath)(addressParameters.stakingPath);
  }

  if (addressParameters.certificatePointer) {
    (0, _paramsValidator.validateParams)(addressParameters.certificatePointer, [{
      name: 'blockIndex',
      type: 'number',
      obligatory: true
    }, {
      name: 'txIndex',
      type: 'number',
      obligatory: true
    }, {
      name: 'certificateIndex',
      type: 'number',
      obligatory: true
    }]);
  }
};

exports.validateAddressParameters = validateAddressParameters;

var addressParametersToProto = function addressParametersToProto(addressParameters) {
  var path = (0, _pathUtils.validatePath)(addressParameters.path, 3);
  var stakingPath = [];

  if (addressParameters.stakingPath) {
    stakingPath = (0, _pathUtils.validatePath)(addressParameters.stakingPath, 3);
  }

  var certificatePointer;

  if (addressParameters.certificatePointer) {
    certificatePointer = {
      block_index: addressParameters.certificatePointer.blockIndex,
      tx_index: addressParameters.certificatePointer.txIndex,
      certificate_index: addressParameters.certificatePointer.certificateIndex
    };
  }

  return {
    address_type: addressParameters.addressType,
    address_n: path,
    address_n_staking: stakingPath,
    staking_key_hash: addressParameters.stakingKeyHash,
    certificate_pointer: certificatePointer
  };
};

exports.addressParametersToProto = addressParametersToProto;

var addressParametersFromProto = function addressParametersFromProto(addressParameters) {
  var certificatePointer;

  if (addressParameters.certificate_pointer) {
    certificatePointer = {
      blockIndex: addressParameters.certificate_pointer.block_index,
      txIndex: addressParameters.certificate_pointer.tx_index,
      certificateIndex: addressParameters.certificate_pointer.certificate_index
    };
  }

  return {
    addressType: addressParameters.address_type,
    path: addressParameters.address_n,
    stakingPath: addressParameters.address_n_staking,
    stakingKeyHash: addressParameters.staking_key_hash,
    certificatePointer: certificatePointer
  };
};

exports.addressParametersFromProto = addressParametersFromProto;