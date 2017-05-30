import { Image } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import settings from 'react-native-simple-store';
import { setTheme } from 'react-native-material-kit';
import Spinner from '@components/OverlaySpinner';
import { replaceRoute } from '@actions/route';
import { setLocations, setSelectedLocation } from '@actions/globals';
import { Styles, Images, Colors } from '@theme/';
import CONFIGS from '@src/configs';
let isLoading = false;

class Splash extends Component {
  constructor(props) {
    super(props);
    setTheme({
      checkboxStyle: {
        fillColor: Colors.brandSecondary,
        borderOnColor: Colors.brandSecondary,
        borderOffColor: Colors.brandSecondary,
        rippleColor: Colors.rippleSecondary,
      },
      radioStyle: {
        fillColor: Colors.brandSecondary,
        borderOnColor: Colors.brandSecondary,
        borderOffColor: Colors.brandSecondary,
        rippleColor: Colors.rippleSecondary,
      },
      primaryColor: Colors.brandSecondary,
      accentColor: 'transparent',
      spinnerVisible: false,
    });
  }
  componentWillMount() {
    this.setState({ spinnerVisible: true });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.globals.coord !== null && !isLoading) {
      isLoading = true;
      // this.setState({ spinnerVisible: false });
      // coords = [{
      //   name: 'Home',
      //   description: 'Your location',
      //   latitude: nextProps.globals.coord.latitude,
      //   longitude: nextProps.globals.coord.longitude,
      //   url: 'https://www.uno.com.my',
      // }];
      // this.props.setLocations(coords);
      this.setState({ spinnerVisible: false });
      this.props.setSelectedLocation(nextProps.globals.coord);
      this.props.replaceRoute('home');
    }
  }
  render() {
    return (
      <Image
        resizeMode={'cover'}
        style={[Styles.fullScreen]}
        source={Images.bkgSplash}>
        <Spinner visible={this.state.spinnerVisible} textContent={"Finding location..."} textStyle={{color: '#FFF'}} />
      </Image>
    );
  }
}

Splash.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setLocations: coords => dispatch(setLocations(coords)),
    setSelectedLocation: coord => dispatch(setSelectedLocation(coord)),
    replaceRoute: route => dispatch(replaceRoute(route)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Splash);
