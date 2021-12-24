import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Identicon from '../../../ui/identicon';
import { toChecksumHexAddressOfPOD } from '../../../../../shared/modules/hexstring-utils';

export default function AccountModalContainer(props, context) {
  const {
    className,
    selectedIdentity,
    showBackButton,
    backButtonAction,
    hideModal,
    children,
    currentCoin,
  } = props;

  return (
    <div
      className={classnames(className, 'account-modal')}
      style={{ borderRadius: '4px' }}
    >
      <div className="account-modal__container">
        <div>
          {/* <Identicon address={selectedIdentity.address} diameter={64} /> */}

          <Identicon
            address={toChecksumHexAddressOfPOD(
              selectedIdentity.address,
              currentCoin,
            )}
            diameter={64}
          />
        </div>
        {showBackButton && (
          <div className="account-modal__back" onClick={backButtonAction}>
            <i className="fa fa-angle-left fa-lg" />
            <span className="account-modal__back-text">
              {context.t('back')}
            </span>
          </div>
        )}
        <button className="account-modal__close" onClick={hideModal} />
        {children}
      </div>
    </div>
  );
}

AccountModalContainer.contextTypes = {
  t: PropTypes.func,
};

AccountModalContainer.defaultProps = {
  showBackButton: false,
  children: null,
  backButtonAction: undefined,
};

AccountModalContainer.propTypes = {
  className: PropTypes.string,
  selectedIdentity: PropTypes.object.isRequired,
  showBackButton: PropTypes.bool,
  backButtonAction: PropTypes.func,
  hideModal: PropTypes.func.isRequired,
  children: PropTypes.node,
};
