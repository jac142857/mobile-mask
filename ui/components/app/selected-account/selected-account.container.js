import { connect } from 'react-redux';
import { getSelectedIdentity, getCoin } from '../../../selectors';
import SelectedAccount from './selected-account.component';

const mapStateToProps = (state) => {
  return {
    selectedIdentity: getSelectedIdentity(state),
    currentCoin: getCoin(state),
  };
};

export default connect(mapStateToProps)(SelectedAccount);
