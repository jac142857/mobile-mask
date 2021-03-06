import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { shortenAddress } from '../../../../helpers/utils/util';
import { isValidDomainName } from '../../../../helpers/utils/util';
import {
  isBurnAddress,
  isValidHexAddress,
} from '../../../../../shared/modules/hexstring-utils';
import { toAddress as to0XAddress } from '../../../../../shared/modules/address-check';

export default class EnsInput extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    className: PropTypes.string,
    selectedAddress: PropTypes.string,
    selectedName: PropTypes.string,
    scanQrCode: PropTypes.func,
    onPaste: PropTypes.func,
    onValidAddressTyped: PropTypes.func,
    internalSearch: PropTypes.bool,
    userInput: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    lookupEnsName: PropTypes.func.isRequired,
    initializeEnsSlice: PropTypes.func.isRequired,
    resetEnsResolution: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.initializeEnsSlice();
  }

  onPaste = (event) => {
    event.clipboardData.items[0].getAsString((text) => {
      if (
        !isBurnAddress(text) &&
        isValidHexAddress(text, { mixedCaseUseChecksum: true })
      ) {
        this.props.onPaste(text);
      }
    });
  };

  onChange = (e) => {
    const {
      onValidAddressTyped,
      internalSearch,
      onChange,
      lookupEnsName,
      resetEnsResolution,
    } = this.props;
    var input = e.target.value;
    if (input.length == 61 && input.startsWith('142857')) {
      input = to0XAddress(input);
    }
    onChange(input);
    if (internalSearch) {
      return null;
    }
    // Empty ENS state if input is empty
    // maybe scan ENS
    if (isValidDomainName(input)) {
      lookupEnsName(input);
    } else {
      resetEnsResolution();
      if (
        onValidAddressTyped &&
        !isBurnAddress(input) &&
        isValidHexAddress(input, { mixedCaseUseChecksum: true })
      ) {
        onValidAddressTyped(input);
      }
    }

    return null;
  };

  render() {
    const { t } = this.context;
    const { className, selectedAddress, selectedName, userInput } = this.props;

    const hasSelectedAddress = Boolean(selectedAddress);

    return (
      <div className={classnames('ens-input', className)}>
        <div
          className={classnames('ens-input__wrapper', {
            'ens-input__wrapper__status-icon--error': false,
            'ens-input__wrapper__status-icon--valid': false,
            'ens-input__wrapper--valid': hasSelectedAddress,
          })}
        >
          <div
            className={classnames('ens-input__wrapper__status-icon', {
              'ens-input__wrapper__status-icon--valid': hasSelectedAddress,
            })}
          />
          {hasSelectedAddress ? (
            <>
              <div className="ens-input__wrapper__input ens-input__wrapper__input--selected">
                <div className="ens-input__selected-input__title">
                  {selectedName || shortenAddress(selectedAddress)}
                </div>
                {selectedName && (
                  <div className="ens-input__selected-input__subtitle">
                    {/* {selectedAddress} */}
                    {shortenAddress(selectedAddress, 10, 6)}
                  </div>
                )}
              </div>
              <div
                className="ens-input__wrapper__action-icon ens-input__wrapper__action-icon--erase"
                onClick={this.props.onReset}
              />
            </>
          ) : (
            <>
              <input
                className="ens-input__wrapper__input"
                type="text"
                dir="auto"
                placeholder={t('recipientAddressPlaceholder')}
                onChange={this.onChange}
                onPaste={this.onPaste}
                value={selectedAddress || userInput}
                autoFocus
                data-testid="ens-input"
              />
              <button
                className={classnames('ens-input__wrapper__action-icon', {
                  'ens-input__wrapper__action-icon--erase': userInput,
                  'ens-input__wrapper__action-icon--qrcode': !userInput,
                })}
                onClick={() => {
                  if (userInput) {
                    this.props.onReset();
                  } else {
                    this.props.scanQrCode();
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}
