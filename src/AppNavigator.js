import React, { Component } from 'react';
import { BackAndroid, Platform, StatusBar, View, Navigator, NativeModules, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

import { popRoute } from '@actions/route';
import { setCurrentLocation } from '@actions/globals';
import { Colors } from '@theme/';
import { closeDrawer, openDrawer } from '@actions/drawer';
import Drawer from 'react-native-drawer'

import Splash from './containers/Splash';
import Login from './containers/Authentication/Login';
import Register from './containers/Authentication/Register';
import ForgotPassword from './containers/Authentication/ForgotPassword';
import Home from './containers/Home';
import Detail from './containers/Detail';
import ControlPanel from './containers/Drawer'

Navigator.prototype.replaceWithAnimation = function (route) {
  const activeLength = this.state.presentedIndex + 1;
  const activeStack = this.state.routeStack.slice(0, activeLength);
  const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
  const nextStack = activeStack.concat([route]);
  const destIndex = nextStack.length - 1;
  const nextSceneConfig = this.props.configureScene(route, nextStack);
  const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);

  const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
  this._emitWillFocus(nextStack[destIndex]);
  this.setState({
    routeStack: nextStack,
    sceneConfigStack: nextAnimationConfigStack,
  }, () => {
    this._enableScene(destIndex);
    this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
      this.immediatelyResetRouteStack(replacedStack);
    });
  });
};
let _this;
export var globalNav = {};
class AppNavigator extends Component {
  constructor(props) {
    super(props);
    _this = this;
  }
  componentWillMount() {
    this.getCurrentCoordinate();
  }
  componentDidMount() {
    globalNav.navigator = this._navigator;
    if(this.props.drawerState == 'opened')
      this.openDrawer();

    if(this.props.drawerState == 'closed')
      this.closeDrawer();
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const routes = this._navigator.getCurrentRoutes();
      if (routes[routes.length - 1].id === 'login') {
        return false;
      }
      this.popRoute();
      return true;
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.drawerState === 'opened') {
      this.openDrawer();
    }
    if (this.props.drawerState === 'closed') {
      this._drawer.close()
    }
  }
  componentWillUnmount() {
    if (this.watchID !== null) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }
  openDrawer() {
    this._drawer.open();
  }
  openNavDrawer() {
    if (this.props.drawerState === 'closed') {
      this.props.openDrawer();
    }
  }
  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }
  popRoute() {
    this.props.popRoute();
  }
  // ////////////////////////get current position/////////////////////////////
  getCurrentCoordinate() {
    if (Platform.OS === 'ios') {
      NativeModules.RNLocation.requestAlwaysAuthorization();
      NativeModules.RNLocation.startUpdatingLocation();
      NativeModules.RNLocation.setDistanceFilter(5.0);
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
        console.log(location);
        const coord = {
          latitude: location.latitude,
          longitude: location.longitude,
        }
        _this.props.setCurrentLocation(coord);
      });
    } else {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: '<h6>Use Location?</h6>This app wants to change your device settings.',
        ok: 'YES',
        cancel: 'NO',
      }).then(function(success) {
        this.watchID = navigator.geolocation.watchPosition((position) => {
          console.log(position);
          const coord = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          _this.props.setCurrentLocation(coord);
        },
        (error) => {
          console.log('error', error);
        });
      }).catch((error) => {
        console.log('catch', error);
      });
    }
  }
  renderScene(route, navigator) {
    switch (route.id) {
      case 'splash':
        return <Splash navigator={navigator} {...route.passProps} />;
      case 'login':
        return <Login navigator={navigator} {...route.passProps} />;
      case 'register':
        return <Register navigator={navigator} {...route.passProps} />;
      case 'forgotpwd':
        return <ForgotPassword navigator={navigator} {...route.passProps} />;
      case 'home':
        return <Home navigator={navigator} {...route.passProps} />;
      case 'detail':
        return <Detail navigator={navigator} {...route.passProps} />;
      default :
        return <Login navigator={navigator} {...route.passProps} />;
    }
  }
  render() {
    return (
      <Drawer
        ref={(ref) => { this._drawer = ref; }}
        type="overlay"
        tweenDuration={100}
        content={<ControlPanel navigator={this._navigator} />}
        tapToClose
        acceptPan={false}
        side="right"
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        styles={{
          drawer: {
            shadowColor: '#000000',
            shadowOpacity: 0.8,
            shadowRadius: 3,
          },
        }}
        tweenHandler={(ratio) => {  //eslint-disable-line
          return {
            drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
            main: {
              opacity: (2 - ratio) / 2,
            },
          };
        }}
        negotiatePan
      >
        <View style={{ flex: 1 }}>
          <Navigator
            ref={(ref) => { this._navigator = ref; }}
            configureScene={(route) => {
              const id = route.id;
              if (id === 'splash' || id === 'login' || id === 'register' || id === 'forgotpwd'
                || id === 'home' || id === 'top10')
                return Navigator.SceneConfigs.FadeAndroid;
              else if (id === 'login') return Navigator.SceneConfigs.PushFromRight;
              else if (id === 'register') return Navigator.SceneConfigs.FadeAndroid;
              return Navigator.SceneConfigs.PushFromRight;
            }}
            initialRoute={{ id: (Platform.OS === 'android') ? 'splash' : 'splash' }}
            renderScene={this.renderScene.bind(this)}
          />
        </View>
      </Drawer>
    );
  }
}
AppNavigator.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    closeDrawer: () => dispatch(closeDrawer()),
    openDrawer: () => dispatch(openDrawer()),
    setCurrentLocation: position => dispatch(setCurrentLocation(position)),
  };
}

function mapStateToProps(state) {
  const { drawerState } = state.get('drawer');
  return { drawerState };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
