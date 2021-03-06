import PropTypes from 'prop-types';
import React from 'react';
import qrCode from 'qrcode-generator';
import { connect } from 'react-redux';
import { isHexPrefixed } from 'ethereumjs-util';
import ReadOnlyInput from '../readonly-input/readonly-input';
import { toChecksumHexAddressOfPOD } from '../../../../shared/modules/hexstring-utils';
import { getCoin } from '../../../selectors';

export default connect(mapStateToProps)(QrCodeView);

function mapStateToProps(state) {
  const { buyView, warning } = state.appState;
  return {
    // Qr code is not fetched from state. 'message' and 'data' props are passed instead.
    buyView,
    warning,
    currentCoin: getCoin(state),
  };
}

function QrCodeView(props) {
  const { Qr, warning, currentCoin } = props;
  const { message, data } = Qr;
  const address = `${
    isHexPrefixed(data) ? 'num:' : ''
  }${toChecksumHexAddressOfPOD(data, currentCoin)}`;
  const qrImage = qrCode(8, 'M');
  qrImage.addData(address);
  qrImage.make();

  return (
    <div className="qr-code">
      {Array.isArray(message) ? (
        <div className="qr-code__message-container">
          {message.map((msg, index) => (
            <div className="qr_code__message" key={index}>
              {msg}
            </div>
          ))}
        </div>
      ) : (
        message && <div className="qr-code__header">{message}</div>
      )}
      {warning && <span className="qr_code__error">{warning}</span>}
      <div
        className="qr-code__wrapper"
        dangerouslySetInnerHTML={{
          __html: qrImage.createTableTag(4),
        }}
      />
      <ReadOnlyInput
        wrapperClass="ellip-address-wrapper"
        autoFocus
        value={toChecksumHexAddressOfPOD(data, currentCoin)}
      />
    </div>
  );
}

QrCodeView.propTypes = {
  warning: PropTypes.node,
  Qr: PropTypes.shape({
    message: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    data: PropTypes.string.isRequired,
  }).isRequired,
};
