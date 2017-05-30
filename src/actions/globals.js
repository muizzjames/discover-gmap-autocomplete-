import Types from './actionTypes';

export const setSpinnerVisible = spinnerVisible =>
  ({ type: Types.SET_SPINNER_VISIBLE, spinnerVisible });
export const setCurrentLocation = coord =>
  ({ type: Types.SET_CURRENT_LOCATION, coord });
export const setSelectedLocation = coord =>
  ({ type: Types.SET_SELECTED_LOCATION, coord });
export const setLocations = coords =>
  ({ type: Types.SET_LOCATIONS, coords });
