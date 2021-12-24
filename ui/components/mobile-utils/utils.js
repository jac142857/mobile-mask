import { getAccountLink, getBlockExplorerLink } from '@metamask/etherscan-link';
import { toChecksumHexAddressOfPOD } from '../../../shared/modules/hexstring-utils';

function getLink(currentCoin, address, chainId, rpcPrefs) {
  var host = rpcPrefs.blockExplorerUrl
    ? rpcPrefs.blockExplorerUrl
    : 'https://www.google.com';

  switch (currentCoin) {
    case 'ETH':
      return getAccountLink(address, chainId, rpcPrefs);
    case 'RCH':
      return (
        host + '/#/address?a=' + toChecksumHexAddressOfPOD(address, currentCoin)
      );
    default:
      return (
        host + '/#/address?a=' + toChecksumHexAddressOfPOD(address, currentCoin)
      );
  }
}

function getTransactionLink(primaryTransaction, rpcPrefs) {
  var host = rpcPrefs.blockExplorerUrl
    ? rpcPrefs.blockExplorerUrl
    : 'https://www.google.com';

  switch (currentCoin) {
    case 'ETH':
      return getBlockExplorerLink(primaryTransaction, rpcPrefs);
    case 'RCH':
      return host + '/#/txDetail?h=' + primaryTransaction.hash;
    default:
      return host + '/#/txDetail?h=' + primaryTransaction.hash;
  }
}

export { getTransactionLink, getLink };
