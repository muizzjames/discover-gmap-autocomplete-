import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  spinnerVisible: false,
  coord: null,
  selectedCoord: null,
  coords:[],
});
const spinnerVisible = (state, action) => ({
  ...state,
  spinnerVisible: action.spinnerVisible,
});
const currentCoord = (state, action) => ({
  ...state,
  coord: action.coord,
});
const selectedCoord = (state, action) => ({
  ...state,
  selectedCoord: action.coord,
});
const setCoords = (state, action) => ({
  ...state,
  coords: action.coords,
});

const actionHandlers = {
  [Types.SET_SPINNER_VISIBLE]: spinnerVisible,
  [Types.SET_CURRENT_LOCATION]: currentCoord,
  [Types.SET_SELECTED_LOCATION]: selectedCoord,
  [Types.SET_LOCATIONS]: setCoords,
};
export default createReducer(initialState, actionHandlers);
