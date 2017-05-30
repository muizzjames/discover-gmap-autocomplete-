import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    backgroundColor: Colors.brandPrimary,
    paddingTop: 30,
    paddingHorizontal: 10,
  },
});
