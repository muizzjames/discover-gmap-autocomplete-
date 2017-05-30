import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
 } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import { AdMobBanner, AdMobRewarded } from 'react-native-admob';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
var {GooglePlacesAutocomplete} = require('@components/GooglePlaceAutoComplete');
import { Styles, Images, Colors, Fonts, Metrics } from '@theme/';
import { replaceRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setSelectedLocation, setLocations, setCurrentLocation } from '@actions/globals';
import Utils from '@src/utils';
import styles from './styles';

let _this;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state={
      mapPress: true,
    }
    _this = this;
  }
  openDrawer() {
    this.props.openDrawer();
  }
  onDetail(item) {
    this.props.navigator.push({
      id: 'detail',
      passProps: {
        item,
      },
    });
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
    this.setState({ mapPress: false });
    this.props.setSelectedLocation(this.props.globals.coord);
    setTimeout(() => {
      this.setState({ mapPress: true });
    }, 800);
  }
  onSetCurrentPosition(data, coord) {
    this.setState({ mapPress: false });
    let tmpCoord={
      latitude: coord.location.lat,
      longitude: coord.location.lng,
    };
    this.props.setSelectedLocation(tmpCoord);
    setTimeout(() => {
      this.setState({ mapPress: true });
    }, 800);
  }
  renderRightButton() {
    return (
      <TouchableOpacity onPress={() => this.openDrawer()}>
        <Icon size={30} name='md-compass' style={{ marginTop: 3, color: 'white'}}/>
      </TouchableOpacity>
    );
  }
  onMapPress() {
    _this.setState({ mapPress: true });
  }
  onRegionChange(region) {
    if (_this.state.mapPress) {
      const coord = {
        latitude: region.latitude,
        longitude: region.longitude,
      }
      _this.props.setSelectedLocation(coord);
    }
  }
  locationButton() {
    return(
      <TouchableOpacity
        onPress={() => this.setState({
          latitude: this.props.globals.coords[0].latitude,
          longitude: this.props.globals.coords[0].longitude,
      })}>
        <Icon size={22} name='md-pin' style={{color: Colors.brandSecondary}}/>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={[Styles.fullScreen, {backgroundColor: 'white'}]}>
        {CommonWidgets.renderStatusBar(Colors.brandPrimary)}
        <View style={{ height: Metrics.screenHeight - 50 }}>
          <View style={{ height: 70, backgroundColor: Colors.brandPrimary}} />
          <View style={{ height: Metrics.screenHeight - 70, backgroundColor: 'white'}}>
            {/*--------------- map----------------- */}
            <MapView
              style={{...StyleSheet.absoluteFillObject}}
              provider={MapView.PROVIDER_GOOGLE}
              onRegionChangeComplete={this.onRegionChange}
              onPress={this.onMapPress}
              initialRegion={{
                latitude: this.props.globals.selectedCoord.latitude,
                longitude: this.props.globals.selectedCoord.longitude,
                latitudeDelta: 0.00522,
                longitudeDelta: (0.00522 * Metrics.screenWidth) / Metrics.screenHeight,
              }}
              region={{
                latitude: this.props.globals.selectedCoord.latitude,
                longitude: this.props.globals.selectedCoord.longitude,
                latitudeDelta: 0.00522,
                longitudeDelta: (0.00522 * Metrics.screenWidth) / Metrics.screenHeight,
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: this.props.globals.selectedCoord.latitude,
                  longitude: this.props.globals.selectedCoord.longitude,
                }}
                description={'home'}
              />
              {this.props.globals.coords.map(function(item){
                return(
                  <MapView.Marker
                    key={item.id}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    description={item.description}
                  >
                    <MapView.Callout onPress={() => _this.onDetail(item)}>
                      <View style={{padding: 3, alignItems: 'center', justifyContent: 'center', borderRadius: 3}}>
                        <Text>{item.name}</Text>
                        <TouchableOpacity
                          style={{ backgroundColor: '#1ca668', borderRadius: 6, padding: 3, paddingHorizontal: 5 }}>
                          <Text style={{ fontSize: 10, color: 'white'}}>Press For More Details</Text>
                        </TouchableOpacity>
                      </View>
                    </MapView.Callout>
                  </MapView.Marker>
                )
              })}
            </MapView>
          </View>
          {/*--------------- Auto complete----------------- */}
          <GooglePlacesAutocomplete
            ref={(ref) => this._googlePlace = ref}
            placeholder='Search'
            minLength={1}
            autoFocus={false}
            onCurrentLocationPress={this.onCurrentLocationPress.bind(this)}
            fetchDetails={true}
            renderRightButton={this.renderRightButton.bind(this)}
            locationButton={this.locationButton.bind(this)}
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

Home.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
  setSpinnerVisible: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    replaceRoute: route => dispatch(replaceRoute(route)),
    setLocations: locations => dispatch(setLocations(locations)),
    setCurrentLocation: location => dispatch(setCurrentLocation(location)),
    setSelectedLocation: location => dispatch(setSelectedLocation(location)),
    openDrawer: () => dispatch(openDrawer()),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
