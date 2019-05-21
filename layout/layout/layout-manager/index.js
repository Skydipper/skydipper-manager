import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'actions/modal';
import { toggleTooltip } from 'actions/tooltip';
import { updateIsLoading } from 'actions/page';
import { setLocale } from 'actions/common';

import LayoutManagerComponent from './layout-manager-component';

export default connect(
  state => ({
    modal: state.modal,
    user: state.user,
    routes: state.routes
  }),
  {
    toggleModal,
    setModalOptions,
    toggleTooltip,
    updateIsLoading,
    setLocale
  }
)(LayoutManagerComponent);
