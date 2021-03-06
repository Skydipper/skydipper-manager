import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

import { connect } from 'react-redux';

import TetherComponent from 'react-tether';

// Next components
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

class DatasetsRelatedContent extends React.Component {
  BUTTONS = {
    layer: true,
    metadata: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      layersActive: false,
      metadataActive: false,
    };

    // BINDINGS
    this.toggleTooltip = debounce(this.toggleTooltip.bind(this), 50);
  }

  toggleTooltip(specificDropdown, to) {
    this.setState({
      ...{
        layersActive: false,
        metadataActive: false,
      },
      [specificDropdown]: to
    });
  }

  render() {
    const { dataset, user, route } = this.props;
    const buttons = { ...this.BUTTONS, ...this.props.buttons };

    const isOwnerOrAdmin = dataset.userId === user.id || user.role === 'ADMIN';

    return (
      <div className="c-related-content">
        <ul>
          {route !== 'profile_detail' && buttons.layer && (
            <li>
              <TetherComponent
                attachment="bottom center"
                constraints={[
                  {
                    to: 'window'
                  }
                ]}
                targetOffset="-4px 0"
                classes={{
                  element: 'c-tooltip'
                }}
              >
                {isOwnerOrAdmin ? (
                  <Link
                    route={route}
                    params={{ tab: 'datasets', id: dataset.id, subtab: 'layers' }}
                  >
                    <a
                      onMouseEnter={() => this.toggleTooltip('layersActive', true)}
                      onMouseLeave={() => this.toggleTooltip('layersActive', false)}
                    >
                      <Icon name="icon-layers" className="c-icon -small" />
                      <span>{(dataset.layer && dataset.layer.length) || 0}</span>
                    </a>
                  </Link>
                ) : (
                  <a
                    onMouseEnter={() => this.toggleTooltip('layersActive', true)}
                    onMouseLeave={() => this.toggleTooltip('layersActive', false)}
                  >
                    <Icon name="icon-layers" className="c-icon -small" />
                    <span>{(dataset.layer && dataset.layer.length) || 0}</span>
                  </a>
                )}

                {this.state.layersActive && (
                  <div>
                    <span>{(dataset.layer && dataset.layer.length) || 0}
{' '}
layers
</span>
                  </div>
                )}
              </TetherComponent>
            </li>
          )}

          {buttons.metadata && (
            <li>
              <TetherComponent
                attachment="bottom center"
                constraints={[
                  {
                    to: 'window'
                  }
                ]}
                targetOffset="-4px 0"
                classes={{
                  element: 'c-tooltip'
                }}
              >
                {isOwnerOrAdmin ? (
                  <Link
                    route={route}
                    params={{ tab: 'datasets', id: dataset.id, subtab: 'metadata' }}
                  >
                    <a
                      className={classnames({
                        '-empty': !dataset.metadata || !dataset.metadata.length
                      })}
                      onMouseEnter={() => this.toggleTooltip('metadataActive', true)}
                      onMouseLeave={() => this.toggleTooltip('metadataActive', false)}
                    >
                      <Icon name="icon-metadata" className="c-icon -small" />
                      <span>{(dataset.metadata && dataset.metadata.length) || 0}</span>
                    </a>
                  </Link>
                ) : (
                  <a
                    className={classnames({
                      '-empty': !dataset.metadata || !dataset.metadata.length
                    })}
                    onMouseEnter={() => this.toggleTooltip('metadataActive', true)}
                    onMouseLeave={() => this.toggleTooltip('metadataActive', false)}
                  >
                    <Icon name="icon-metadata" className="c-icon -small" />
                    <span>{(dataset.metadata && dataset.metadata.length) || 0}</span>
                  </a>
                )}

                {this.state.metadataActive && (
                  <div>
                    <span>{(dataset.metadata && dataset.metadata.length) || 0}
{' '}
metadata
</span>
                  </div>
                )}
              </TetherComponent>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

DatasetsRelatedContent.propTypes = {
  user: PropTypes.object,
  dataset: PropTypes.object,
  route: PropTypes.string,
  buttons: PropTypes.object
};

export default connect(state => ({
  user: state.user
}))(DatasetsRelatedContent);
