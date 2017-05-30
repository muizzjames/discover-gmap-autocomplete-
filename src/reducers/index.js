import { combineReducers } from 'redux-immutable';
import globals from './globals';
import route from './route';
import drawer from './drawer';
const applicationReducers = {
  globals,
  route,
  drawer,
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
