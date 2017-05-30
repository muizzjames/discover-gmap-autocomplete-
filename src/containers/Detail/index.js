import React, { Component } from 'react';
import { Text, TextInput, Image, View, StyleSheet, TouchableOpacity, WebView } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import { AdMobBanner, AdMobRewarded } from 'react-native-admob';
import Icon from 'react-native-vector-icons/Ionicons';
var {GooglePlacesAutocomplete} = require('@components/GooglePlaceAutoComplete');
import { replaceRoute, popRoute } from '@actions/route';
import { setLocations } from '@actions/globals';
import CommonWidgets from '@components/CommonWidgets';
import { Styles, Colors, Fonts, Metrics } from '@theme/';

import { setSpinnerVisible } from '@actions/globals';
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    AdMobRewarded.setAdUnitID('ca-app-pub-6343289823091285/7121518885');
    AdMobRewarded.addEventListener('rewardedVideoDidRewardUser',
      (type, amount) => console.log('rewardedVideoDidRewardUser', type, amount));
    AdMobRewarded.addEventListener('rewardedVideoDidLoad', () => console.log('rewardedVideoDidLoad'));
    AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', (error) => console.log('rewardedVideoDidFailToLoad', error));
    AdMobRewarded.addEventListener('rewardedVideoDidOpen', () => console.log('rewardedVideoDidOpen'));
    AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {
      console.log('rewardedVideoDidClose');
      AdMobRewarded.requestAd((error) => error && console.log(error));
    });
    AdMobRewarded.addEventListener('rewardedVideoWillLeaveApplication', () => console.log('rewardedVideoWillLeaveApplication'));
    AdMobRewarded.requestAd((error) => error && console.log(error));
  }
  componentWillUnmount() {
    AdMobRewarded.removeAllListeners();
  }
  onCurrentLocationPress() {
    let coords=[{
      name: 'current location',
      description: 'current location',
      latitude: this.props.globals.coord.latitude,
      longitude: this.props.globals.coord.longitude,
      url: '',
    }];
    this.props.setLocations(coords);
    this.props.replaceRoute('home');
  }
  onSetCurrentPosition(data, coord) {
    let coords=[{
      name: data.terms[0].value,
      description: data.description,
      latitude: coord.location.lat,
      longitude: coord.location.lng,
      url: '',
    }];
    this.props.setLocations(coords);
    this.props.replaceRoute('home');
  }
  renderLeftButton() {
    return (
      <TouchableOpacity onPress={() => this.props.popRoute()} style={{ marginRight: 20}}>
        <Icon size={30} name='ios-arrow-back' style={{ marginTop: 3, color: 'white'}}/>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={[Styles.fullScreen, {backgroundColor: Colors.brandPrimary}]}>
        {CommonWidgets.renderStatusBar(Colors.brandPrimary)}
        <View style={{ height: Metrics.screenHeight - 50 }}>
          <View style={{ height: 70, backgroundColor: Colors.brandPrimary}} />
          <View style={{ height: Metrics.screenHeight - 120, backgroundColor: Colors.brandPrimary}}>
            {/*--------------- Web view ----------------- */}
            <WebView
              source={{uri: this.props.item.url}}
            />
          </View>
          {/*--------------- Auto complete----------------- */}
          <GooglePlacesAutocomplete
            ref={(ref) => this._googlePlace = ref}
            placeholder='Search'
            minLength={1}
            autoFocus={false}
            fetchDetails={true}
            onCurrentLocationPress={this.onCurrentLocationPress.bind(this)}
            renderLeftButton={this.renderLeftButton.bind(this)}
            onPress={(data, details = null) => {
              var selectAddress = {description: data.description, geometry: { location: { lat: details.geometry.location.lat, lng: details.geometry.location.lng } }};
              this.onSetCurrentPosition(data, details.geometry);
            }}
            getDefaultValue={() => { return ''; }}
            query={{
              key: 'AIzaSyDn_iKru1ueVvJjjJhSNV_Snnc6z5BMZNk',
              language: 'en', // language of the results
              types: 'address', // default: 'geocode'
            }}
            styles={{
              description: { fontWeight: 'bold' },
              predefinedPlacesDescription: { color: '#1faadb' },
            }}
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
            }}
            GooglePlacesSearchQuery={{
            }}
            enablePoweredByContainer = {true}
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          />
        </View>
        {/*--------------- Admob ----------------- */}
        <AdMobBanner
          style={{ marginLeft: (Metrics.screenWidth - 320) / 2 }}
          bannerSize={'banner'}
          adUnitID="ca-app-pub-8980758856340772/5123022847"
        />
      </View>
    );
  }
}

Detail.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
  setSpinnerVisible: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    replaceRoute: route => dispatch(replaceRoute(route)),
    setLocations: coords => dispatch(setLocations(coords)),
    popRoute: () => dispatch(popRoute()),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Detail);
