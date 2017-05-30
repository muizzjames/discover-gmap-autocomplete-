import React, {Component} from 'React';
import {
  ScrollView,
  View,
} from 'react-native'
import { connect } from 'react-redux';
import { replaceRoute } from '@actions/route';
import { closeDrawer } from '@actions/drawer';
import OverlaySpinner from '@components/OverlaySpinner';
import { Metrics, Styles, Icons, Colors, Fonts, Images } from '@theme/';
import { List, ListItem } from 'react-native-elements'

import styles from './styles';
import dummydata from '../../dummydata';
import Utils from '@src/utils';
const list = [
  {
    title: 'ATM',
    route: 'atm',
    icon: 'av-timer'
  },
]

class ControlPanel extends Component {
  getATM () {
    let baseUrl = 'https://demo8787173.mockable.io/atm?latlng=' +
                  this.props.globals.selectedCoord.latitude +',' +
                  this.props.globals.selectedCoord.longitude;
    fetch(baseUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    .then(response => {
      if (response.ok === true)
        return response.json();
      else {
        return null;
      }
    })
    .then((responseData) => {
      if (responseData === null) {
        Utils.toast('no result found');
        this.props.setLocations([]);
      } else {
        this.props.setLocations(responseData.LOCATIONS);
      }
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  onGotoRoute(item) {
    this.props.closeDrawer();
    if (this.props.routes.routes.toString() === item.route) {
      return;
    }
    switch (item.title) {
      case 'ATM':
        this.getATM();
        break;
      // case 'HOME':
      //   this.props.replaceRoute('home');
      //   break;
      default:
        this.props.closeDrawer();
    }
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerView}>
        </View>
        <View>
          <List containerStyle={{borderBottomWidth: 0, borderTopWidth: 0}}>
          {
            list.map((item, i) => (
              <ListItem
                key={i}
                style={{ borderBottomWidth: 0}}
                title={item.title}
                hideChevron
                leftIcon={{name: item.icon}}
                onPress={() => this.onGotoRoute(item)}
              />
            ))
          }
          </List>
        </View>
      </ScrollView>
    )
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    replaceRoute: route => dispatch(replaceRoute(route)),
    closeDrawer: () => dispatch(closeDrawer()),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const routes = state.get('route');
  return { globals, routes };
}
export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
