"use strict";

exports.__esModule = true;
exports.tokenBundleToProto = exports.validateTokenBundle = void 0;

var _paramsValidator = require("../helpers/paramsValidator");

var validateTokens = function validateTokens(tokenAmounts) {
  tokenAmounts.forEach(function (tokenAmount) {
    (0, _paramsValidator.validateParams)(tokenAmount, [{
      name: 'assetNameBytes',
      type: 'string',
      obligatory: true
    }, {
      name: 'amount',
      type: 'amount',
      obligatory: true
    }]);
  });
};

var validateTokenBundle = function validateTokenBundle(tokenBundle) {
  tokenBundle.forEach(function (tokenGroup) {
    (0, _paramsValidator.validateParams)(tokenGroup, [{
      name: 'policyId',
      type: 'string',
      obligatory: true
    }, {
      name: 'tokenAmounts',
      type: 'array',
      obligatory: true
    }]);
    validateTokens(tokenGroup.tokenAmounts);
  });
};

exports.validateTokenBundle = validateTokenBundle;

var tokenAmountsToProto = function tokenAmountsToProto(tokenAmounts) {
  return tokenAmounts.map(function (tokenAmount) {
    return {
      asset_name_bytes: tokenAmount.assetNameBytes,
      amount: tokenAmount.amount
    };
  });
};

var tokenBundleToProto = function tokenBundleToProto(tokenBundle) {
  return tokenBundle.map(function (tokenGroup) {
    return {
      policy_id: tokenGroup.policyId,
      tokens: tokenAmountsToProto(tokenGroup.tokenAmounts)
    };
  });
};

exports.tokenBundleToProto = tokenBundleToProto;