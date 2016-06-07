import {expect} from 'chai';

import * as types from '../src/constants/ActionTypes';
import products from '../src/reducers/products.js';

describe('Product Reducer', () => {

  it('should return initState when no action is defined', () => {
    const initState = {};
    const resultState = products(initState, {});

    expect(resultState).to.be.empty;
  });

  it('should set state.additionalInput to given input', () => {
    const resultString = 'Result';
    const initState = { additionalInput: 'Init' };
    const resultState = products(initState, { type: types.SET_INPUT, input: resultString });

    expect(resultState).to.have.property('additionalInput', resultString);
  });

  it('should set state.operation to given operation and enable input', () => {
    const resultString = 'in';
    const initState = {};
    const resultState = products(initState, { type: types.SET_OPERATION, operation: 'in' });

    expect(resultState).to.have.property('operation', resultString);
    expect(resultState).to.have.property('enableInput', true);
  });

  it('should set state.enableInput to false if operation is any/none', () => {
    const initState = {};
    const resultState = products(initState, { type: types.SET_OPERATION, operation: 'any' });

    expect(resultState).to.have.property('enableInput', false);
  });

});

describe('Filter Tests', () => {
  it('should return products with matching product names (equals)', () => {
    const initState = {
      property: 'name',
      operation: 'equals',
      additionalInput: 'headphones',
      allProducts: [
        { properties: [{ property_id: 'name', value: 'headphones'}] },
        { properties: [{ property_id: 'name', value: 'keys' }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    // TODO: Eventually I want to integrate immutable.js into this thing.
    //       There's not to much use right now for the actual app b/c I only have
    //       one reducer, but immutable.js would make these tests way cleaner.
    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(1);
    expect(resultState.filteredProducts[0].properties[0].value).to.equal('headphones');
  });

  it('should return products with weights greater than 2 (greater_than)', () => {
    const initState = {
      property: 'weight',
      operation: 'greater_than',
      additionalInput: 2,
      allProducts: [
        { properties: [{ property_id: 'weight', value: 3}] },
        { properties: [{ property_id: 'weight', value: 2 }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(1);
    expect(resultState.filteredProducts[0].properties[0].value).to.equal(3);
  });

  it('should return products with weights less than 2 (less_than)', () => {
    const initState = {
      property: 'weight',
      operation: 'less_than',
      additionalInput: 2,
      allProducts: [
        { properties: [{ property_id: 'weight', value: 3 }] },
        { properties: [{ property_id: 'weight', value: 1 }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(1);
    expect(resultState.filteredProducts[0].properties[0].value).to.equal(1);
  });

  it('should return products where specified property exists (any)', () => {
    const initState = {
      property: 'weight',
      operation: 'any',
      allProducts: [
        { properties: [{ property_id: 'name', value: 'canned air' }] },
        { properties: [{ property_id: 'name', value: 'heavier air' }, { property_id: 'weight', value: 1 }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(1);
    expect(resultState.filteredProducts[0].properties[0].value).to.equal('heavier air');
  });

  it('should return products where specified property does NOT exist (none)', () => {
    const initState = {
      property: 'weight',
      operation: 'none',
      allProducts: [
        { properties: [{ property_id: 'name', value: 'canned air' }] },
        { properties: [{ property_id: 'name', value: 'heavier air' }, { property_id: 'weight', value: 1 }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(1);
    expect(resultState.filteredProducts[0].properties[0].value).to.equal('canned air');
  });

  it('should return products where specified property is any from a comma separated list (in)', () => {
    const initState = {
      property: 'name',
      operation: 'in',
      additionalInput: 'headphones, keys',
      allProducts: [
        { properties: [{ property_id: 'name', value: 'headphones' }] },
        { properties: [{ property_id: 'name', value: 'keys' }] },
        { properties: [{ property_id: 'name', value: 'air' }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(2);
  });

  it('should return products where name contains (in)', () => {
    const initState = {
      property: 'name',
      operation: 'in',
      additionalInput: 'headphones, keys',
      allProducts: [
        { properties: [{ property_id: 'name', value: 'headphones' }] },
        { properties: [{ property_id: 'name', value: 'keys' }] },
        { properties: [{ property_id: 'name', value: 'air' }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(2);
  });

  it('should return products where the name contains the specified string (in)', () => {
    const initState = {
      property: 'name',
      operation: 'contains',
      additionalInput: 'phone',
      allProducts: [
        { properties: [{ property_id: 'name', value: 'headphones' }] },
        { properties: [{ property_id: 'name', value: 'cellphone' }] },
        { properties: [{ property_id: 'name', value: 'computer' }] },
      ],
    };

    const resultState = products(initState, { type: types.APPLY_FILTER });

    expect(resultState).to.have.property('filteredProducts');
    expect(resultState.filteredProducts).to.have.lengthOf(2);
  });
});
