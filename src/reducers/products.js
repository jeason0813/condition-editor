import _ from 'lodash';
import { APPLY_FILTER, CLEAR_FILTER, SET_PROPERTY, SET_OPERATION, SET_INPUT } from '../constants/ActionTypes';
import { PRODUCTS, PROPERTIES, OPERATORS } from '../constants/Data';

const initialState = {
  allProducts: PRODUCTS,
  filteredProducts: PRODUCTS,
  filters: initFilters(PROPERTIES),
  ops: [],
  property: null,
  operation: '',
  additionalInput: '',
  enableInput: false,
};

function initFilters(props) {
  const filters = {};

  /* Note: This is not currently not the most flexible initialization, but for
  **       now I am simply hard-coding the validOps per prop type based on
  **       the requirements listed here:
  **       http://salsify.github.io/condition-editor-coding-exercise/
  */
  props.forEach(prop => {
    let validOps;

    switch(prop.type) {
      case 'string':
        validOps = OPERATORS.slice(0,1).concat(OPERATORS.slice(3,7));
        break;

      case 'number':
        validOps = OPERATORS.slice(0,6);
        break;

      case 'enumerated':
        validOps = OPERATORS.slice(0,1).concat(OPERATORS.slice(3, 6));
        break;

      default:
        break;
    }

    filters[prop.id] = Object.assign({}, prop, { validOps });
  });

  return filters;
}

const operatorFns = {
  equals: function(a, b) {
    if (!b || !b.value) return false;
    const bVal = b.value;

    const type = isNaN(parseInt(a)) ? 'string' : 'number';

    if (type !== typeof bVal) {
      return false;
    } else if (type === 'string') {
      return a.toLowerCase().trim() === bVal.toLowerCase().trim();
    } else {
      return parseInt(a) === bVal;
    }
  },

  greater_than: function(a, b) {
    if (!b || !b.value) return false;
    const aVal = parseInt(a);
    const bVal = b.value;

    if (typeof aVal !== 'number') {
      return false;
    } else {
      return bVal > aVal;
    }
  },

  less_than: function(a, b) {
    if (!b || !b.value) return false;
    const aVal = parseInt(a);
    const bVal = b.value;

    if (typeof aVal !== 'number') {
      return false;
    } else {
      return bVal < aVal;
    }
  },

  any: function(a, b) {
    return b && b.value;
  },

  none: function(a, b) {
    return !b;
  },

  in: function(a, b) {
    if (!b || !b.value) return false;

    const aVal = a.toLowerCase().replace(/\s+/g, '').split(',');
    const bVal = b.value.toLowerCase();

    return aVal.indexOf(bVal) > -1;
  },

  contains: function(a, b) {
    if (!b || !b.value) return false;
    const bVal = b.value.toLowerCase();

    return bVal.includes(a);
  }
}

export default function products(state = initialState, action = {}) {
  switch (action.type) {
    case APPLY_FILTER:
      const filteredProducts = _.filter(state.allProducts, (product) => {
        if (state.additionalInput === '' && state.operation !== 'any' && state.operation !== 'none') return true;
        return operatorFns[state.operation](state.additionalInput, _.find(product.properties, prop => prop.property_id === state.property));
      });

      return {
        ...state,
        filteredProducts,
      };

    case CLEAR_FILTER:
      return {
        ...state,
        property: null,
        ops: [],
        additionalInput: '',
        enableInput: false,
        filteredProducts: state.allProducts,
      };

    case SET_PROPERTY:
      let property = parseInt(action.property);
      if (Number.isNaN(property)) property = action.property;

      return {
        ...state,
        property,
        ops: state.filters[action.property].validOps,
      }

    case SET_OPERATION:
      const enableInput = action.operation === 'any' || action.operation === 'none' ? false : true;
      return {
        ...state,
        operation: action.operation,
        enableInput,
      }

    case SET_INPUT:
      return {
        ...state,
        additionalInput: action.input,
      }

    default:
      return state;
  }
}
