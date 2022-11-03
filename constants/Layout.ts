import { Dimensions } from 'react-native';
import * as Constants from 'expo-constants'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const topMargin = Constants.default.statusBarHeight

export default {
  window: {
    width,
    height,
    topMargin
  },
  isSmallDevice: width < 375,
};
