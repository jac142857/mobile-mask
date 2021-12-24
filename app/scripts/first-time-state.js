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
        rpcUrl: 'https://rpc.142857.me',
        chainId: '0x4c7',
        ticker: 'NUM',
        nickname: 'NUM MainNet',
        rpcPrefs: { blockExplorerUrl: 'https://142857.pro/explorer' },
      }
    ],
  },
};

export default initialState;
