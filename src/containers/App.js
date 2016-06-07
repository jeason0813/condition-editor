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
    const { products, filters, showAdditionalInput, ops, actions } = this.props;

    return (
      <div className="app">
        <Filters {...actions}
                 properties={filters}
                 ops={ops}
                 showAdditionalInput={showAdditionalInput} />
        <ProductSection products={products} />
      </div>
    )
  };
};

App.propTypes = {
  products: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  ops: PropTypes.array.isRequired,
  showAdditionalInput: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    products: state.products.filteredProducts,
    filters: state.products.filters,
    ops: state.products.ops,
    showAdditionalInput: state.products.showAdditionalInput,
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
