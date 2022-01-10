/**
 * @typedef {Object} FirstTimeState
 * @property {Object} config Initial configuration parameters
 * @property {Object} NetworkController Network controller state
 */

/**
 * @type {FirstTimeState}
 */
const initialState = {
  config: {},
  PreferencesController: {
    frequentRpcListDetail: [
      {
        // http://3.229.101.253:8489  https://rpc.142857.me
        rpcUrl: 'http://3.229.101.253:8489',
        chainId: '0x1346601',
        ticker: 'NUM',
        nickname: 'NUM MainNet',
        rpcPrefs: { blockExplorerUrl: 'https://142857.pro/explorer' },
      },
    ],
  },
};

export default initialState;
