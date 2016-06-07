import * as types from '../constants/ActionTypes';

export function applyFilter(name, operator, value) {
  return { type: types.APPLY_FILTER, name, operator, value };
}

export function clearFilter() {
  return { type: types.CLEAR_FILTER };
}

export function setProperty(property) {
  return { type: types.SET_PROPERTY, property };
}

export function setOperation(operation) {
  return { type: types.SET_OPERATION, operation };
}

export function setInput(input) {
  return { type: types.SET_INPUT, input };
}
