import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ProductActions from '../actions';
import ProductSection from '../components/ProductSection';
import Filters from '../components/Filters';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      actions,
      enableInput,
      filters,
      ops,
      products,
    } = this.props;

    return (
      <div className="app">
        <Filters {...actions}
                 enableInput={enableInput}
                 ops={ops}
                 properties={filters} />
        <ProductSection products={products} />
      </div>
    )
  };
};

App.propTypes = {
  actions: PropTypes.object.isRequired,
  enableInput: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  ops: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    enableInput: state.products.enableInput,
    filters: state.products.filters,
    ops: state.products.ops,
    products: state.products.filteredProducts,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProductActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
