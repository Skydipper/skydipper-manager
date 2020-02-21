import { connect } from 'react-redux';

// component
import LayoutManagerDataDetail from './component';

export default connect(
  /** @type {(state: any) => any} state */
  state => ({
    id: state.routes.query.id,
    tab: state.routes.query.tab,
    token: state.user.token,
  }),
  null
)(LayoutManagerDataDetail);
