import React, { Component, PropTypes } from 'react';

export default class ProductSection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { products } = this.props;
    const renderedProducts = products.map((product, idx) => {
      let length = product.properties.length;
      let properties = [];

      for (let i = 0; i < length; i++) {
        properties.push(<div key={`pv_${idx}_${i}`}>{product.properties[i].value}</div>);
      }

      return <div key={`p_${idx}`} className="product">{properties}</div>;
    });

    return (
      <div className="products">
        {renderedProducts}
      </div>
    )
  }
}

ProductSection.propTypes = {
  products: PropTypes.array.isRequired,
};
