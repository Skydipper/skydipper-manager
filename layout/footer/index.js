import { connect } from 'react-redux';

// selectors
import { getMenu } from './selectors';

// component
import Footer from './component';

export default connect(
  () => ({
    menu: getMenu()
  }),
  null
)(Footer);
