import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';
import classnames from 'classnames';

// vizzuality-components
import { Icons } from 'vizzuality-components';

// Components
import { Router } from 'routes';
import HeadApp from 'layout/head/app';
import Header from 'layout/header';
import Footer from 'layout/footer';

import Tooltip from 'components/ui/Tooltip';
import Modal from 'components/ui/Modal';
import Toastr from 'react-redux-toastr';

class LayoutApp extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    pageHeader: PropTypes.bool,
    className: PropTypes.string,
    modal: PropTypes.shape({
      options: PropTypes.object,
      loading: PropTypes.bool
    }).isRequired,
    isFullScreen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    setModalOptions: PropTypes.func.isRequired,
    updateIsLoading: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: null,
    description: null,
    className: null,
    pageHeader: false
  };

  state = { modalOpen: false };

  componentDidMount() {
    const { updateIsLoading } = this.props;

    Router.onRouteChangeStart = () => {
      updateIsLoading(true);
      if (Progress && Progress.Component.instance) Progress.show();
    };
    Router.onRouteChangeComplete = () => {
      updateIsLoading(false);
      if (Progress && Progress.Component.instance) Progress.hideAll();
    };
  }

  componentWillReceiveProps(newProps) {
    const { modalOpen } = this.state;
    if (modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  render() {
    const { modalOpen } = this.state;
    const {
      title,
      description,
      pageHeader,
      modal,
      className,
      isFullScreen,
      children,
      toggleModal,
      setModalOptions
    } = this.props;
    const componentClass = classnames('l-page', { [className]: !!className });

    return (
      <div id="#main" className={componentClass}>
        <HeadApp title={title} description={description} />

        <Icons />

        <Header pageHeader={pageHeader} />

        <Progress.Component />

        {children}

        {!isFullScreen && <Footer />}

        <Tooltip />

        <Modal
          open={modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={toggleModal}
          setModalOptions={setModalOptions}
        />

        <Toastr preventDuplicates transitionIn="fadeIn" transitionOut="fadeOut" />
      </div>
    );
  }
}

export default LayoutApp;
