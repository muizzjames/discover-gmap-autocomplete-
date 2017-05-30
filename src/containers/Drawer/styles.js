import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  controlText: {
    color: 'white',
  },
  headerView: {
    height: Metrics.screenHeight / 3,
    backgroundColor: Colors.brandPrimary
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  name: {
    position: 'absolute',
    left: 25,
    top: 140,
    backgroundColor: 'transparent',
    color: 'white',
    fontWeight: 'bold'
  },
});
