import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class Filters extends Component {
  constructor(props) {
    super(props);

    this._onClear = this._onClear.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._setInput = this._setInput.bind(this);
    this._setOperation = this._setOperation.bind(this);
    this._setProperty = this._setProperty.bind(this);
  }

  _onSubmit(e) {
    e.preventDefault();
    this.props.applyFilter();
  }

  _onClear() {
    this.props.clearFilter();
    this.refs.properties.selectedIndex = 0;
    this.refs.input.value = '';
  }

  _setInput(e) {
    this.props.setInput(e.target.value);
  }

  _setOperation(e) {
    this.props.setOperation(e.target.value);
  }

  _setProperty(e) {
    this.props.setProperty(e.target.value);
  }

  render() {
    const {
      enableInput,
      ops,
      properties,
    } = this.props;

    const propertyOptions = (
      <select defaultValue="" onChange={this._setProperty} ref="properties">
        <option value="" disabled>- Property -</option>
        {_.map(properties, prop => {
          return (<option key={`po_${prop.id}`}
                          value={prop.id}>{prop.name}</option>);
        })}
      </select>
    );

    const operationOptions = (
      <select defaultValue="" onChange={this._setOperation}>
        <option value="" disabled>- Operator -</option>
        {ops.map(op => {
          return (<option key={`oo_${op.id}`}
                          value={op.id}>{op.text}</option>);
        })}
      </select>
    );

    const placeholderText = enableInput ? "Enter value..." : "N/A";

    return (
      <div className="filter-container">
        <form className="filter-form" onSubmit={this._onSubmit}>
          {propertyOptions}
          {operationOptions}
          <input disabled={!enableInput} placeholder={placeholderText} onChange={this._setInput} ref="input" />
          <button onClick={this._onSubmit}>Submit</button>
          <button onClick={this._onClear}>Clear</button>
        </form>
      </div>
    );
  }
}

Filters.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  enableInput: PropTypes.bool.isRequired,
  ops: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired,
  setProperty: PropTypes.func.isRequired,
  setOperation: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
};
