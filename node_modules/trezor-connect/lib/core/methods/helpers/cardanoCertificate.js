"use strict";

exports.__esModule = true;
exports.transformCertificate = void 0;

var _paramsValidator = require("./paramsValidator");

var _cardano = require("../../../constants/cardano");

var _pathUtils = require("../../../utils/pathUtils");

var _constants = require("../../../constants");

var ipv4AddressToHex = function ipv4AddressToHex(ipv4Address) {
  return Buffer.from(ipv4Address.split('.').map(function (ipPart) {
    return parseInt(ipPart);
  })).toString('hex');
};

var ipv6AddressToHex = function ipv6AddressToHex(ipv6Address) {
  return ipv6Address.split(':').join('');
};

var validatePoolMargin = function validatePoolMargin(margin) {
  (0, _paramsValidator.validateParams)(margin, [{
    name: 'numerator',
    type: 'string',
    obligatory: true
  }, {
    name: 'denominator',
    type: 'string',
    obligatory: true
  }]);
};

var validatePoolMetadata = function validatePoolMetadata(metadata) {
  (0, _paramsValidator.validateParams)(metadata, [{
    name: 'url',
    type: 'string',
    obligatory: true
  }, {
    name: 'hash',
    type: 'string',
    obligatory: true
  }]);
};

var validatePoolRelay = function validatePoolRelay(relay) {
  (0, _paramsValidator.validateParams)(relay, [{
    name: 'type',
    type: 'number',
    obligatory: true
  }]);

  if (relay.type === _cardano.POOL_RELAY_TYPE.SingleHostIp) {
    var paramsToValidate = [{
      name: 'port',
      type: 'number',
      obligatory: true
    }];

    if (relay.ipv4Address) {
      paramsToValidate.push({
        name: 'ipv4Address',
        type: 'string'
      });
    }

    if (relay.ipv6Address) {
      paramsToValidate.push({
        name: 'ipv6Address',
        type: 'string'
      });
    }

    (0, _paramsValidator.validateParams)(relay, paramsToValidate);

    if (!relay.ipv4Address && !relay.ipv6Address) {
      throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Either ipv4Address or ipv6Address must be supplied');
    }
  } else if (relay.type === _cardano.POOL_RELAY_TYPE.SingleHostName) {
    (0, _paramsValidator.validateParams)(relay, [{
      name: 'hostName',
      type: 'string',
      obligatory: true
    }, {
      name: 'port',
      type: 'number',
      obligatory: true
    }]);
  } else if (_cardano.POOL_RELAY_TYPE.MultipleHostName) {
    (0, _paramsValidator.validateParams)(relay, [{
      name: 'hostName',
      type: 'string',
      obligatory: true
    }]);
  }
};

var validatePoolOwners = function validatePoolOwners(owners) {
  owners.forEach(function (owner) {
    if (owner.stakingKeyHash) {
      (0, _paramsValidator.validateParams)(owner, [{
        name: 'stakingKeyHash',
        type: 'string',
        obligatory: !owner.stakingKeyPath
      }]);
    }

    if (owner.stakingKeyPath) {
      (0, _pathUtils.validatePath)(owner.stakingKeyPath, 5);
    }

    if (!owner.stakingKeyHash && !owner.stakingKeyPath) {
      throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Either stakingKeyHash or stakingKeyPath must be supplied');
    }
  });
  var ownersAsPathCount = owners.filter(function (owner) {
    return !!owner.stakingKeyPath;
  }).length;

  if (ownersAsPathCount !== 1) {
    throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Exactly one pool owner must be given as a path');
  }
};

var validatePoolParameters = function validatePoolParameters(poolParameters) {
  (0, _paramsValidator.validateParams)(poolParameters, [{
    name: 'poolId',
    type: 'string',
    obligatory: true
  }, {
    name: 'vrfKeyHash',
    type: 'string',
    obligatory: true
  }, {
    name: 'pledge',
    type: 'string',
    obligatory: true
  }, {
    name: 'cost',
    type: 'string',
    obligatory: true
  }, {
    name: 'margin',
    type: 'object',
    obligatory: true
  }, {
    name: 'rewardAccount',
    type: 'string',
    obligatory: true
  }, {
    name: 'owners',
    type: 'array',
    obligatory: true
  }, {
    name: 'relays',
    type: 'array',
    obligatory: true,
    allowEmpty: true
  }, {
    name: 'metadata',
    type: 'object'
  }]);
  validatePoolMargin(poolParameters.margin);
  validatePoolOwners(poolParameters.owners);
  poolParameters.relays.forEach(validatePoolRelay);

  if (poolParameters.metadata) {
    validatePoolMetadata(poolParameters.metadata);
  }
};

var transformPoolParameters = function transformPoolParameters(poolParameters) {
  validatePoolParameters(poolParameters);
  return {
    pool_id: poolParameters.poolId,
    vrf_key_hash: poolParameters.vrfKeyHash,
    pledge: poolParameters.pledge,
    cost: poolParameters.cost,
    margin_numerator: poolParameters.margin.numerator,
    margin_denominator: poolParameters.margin.denominator,
    reward_account: poolParameters.rewardAccount,
    owners: poolParameters.owners.map(function (owner) {
      return {
        staking_key_hash: owner.stakingKeyHash,
        staking_key_path: owner.stakingKeyPath ? (0, _pathUtils.validatePath)(owner.stakingKeyPath, 5) : undefined
      };
    }),
    relays: poolParameters.relays.map(function (relay) {
      return {
        type: relay.type,
        ipv4_address: relay.ipv4Address ? ipv4AddressToHex(relay.ipv4Address) : undefined,
        ipv6_address: relay.ipv6Address ? ipv6AddressToHex(relay.ipv6Address) : undefined,
        host_name: relay.hostName,
        port: relay.port
      };
    }),
    metadata: poolParameters.metadata
  };
}; // transform incoming certificate object to protobuf messages format


var transformCertificate = function transformCertificate(certificate) {
  var paramsToValidate = [{
    name: 'type',
    type: 'number',
    obligatory: true
  }];

  if (certificate.type !== _cardano.CERTIFICATE_TYPE.StakePoolRegistration) {
    paramsToValidate.push({
      name: 'path',
      obligatory: true
    });
  }

  if (certificate.type === _cardano.CERTIFICATE_TYPE.StakeDelegation) {
    paramsToValidate.push({
      name: 'pool',
      type: 'string',
      obligatory: true
    });
  }

  if (certificate.type === _cardano.CERTIFICATE_TYPE.StakePoolRegistration) {
    paramsToValidate.push({
      name: 'poolParameters',
      type: 'object',
      obligatory: true
    });
  }

  (0, _paramsValidator.validateParams)(certificate, paramsToValidate);
  return {
    type: certificate.type,
    path: certificate.path ? (0, _pathUtils.validatePath)(certificate.path, 5) : undefined,
    pool: certificate.pool,
    pool_parameters: certificate.poolParameters ? transformPoolParameters(certificate.poolParameters) : undefined
  };
};

exports.transformCertificate = transformCertificate;