import { connect } from 'react-redux';

// actions
import { toggleModal, setModalOptions } from 'actions/modal';
import { toggleTooltip } from 'actions/tooltip';
import { updateIsLoading } from 'actions/page';

// selectors
import { isFullScreen } from './selectors';

// component
import LayoutApp from './component';

export default connect(
  state => ({
    modal: state.modal,
    isFullScreen: isFullScreen(state)
  }),
  {
    toggleModal,
    setModalOptions,
    toggleTooltip,
    updateIsLoading
  }
)(LayoutApp);
