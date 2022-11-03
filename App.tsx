import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ContextProvider } from './components/Variables';
import Layout from "./constants/Layout";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import BaseScreen from './screens/base';


const { height, width, topMargin } = Layout.window;


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
const Stack = createNativeStackNavigator();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ContextProvider>
          {/* <Navigation colorScheme={colorScheme} /> */}
          <NavigationContainer
            linking={LinkingConfiguration}
            // theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack.Navigator>
              <Stack.Screen name="Base" component={BaseScreen} options={{headerShown:false}} />
            </Stack.Navigator>
            
          </NavigationContainer>
        </ContextProvider>
        <FlashMessage
          style={{
            width: width - 100,
            height: height / 8,
            borderRadius: 15,
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: topMargin,
            marginLeft: 50,
          }}
          position="top"
          duration={6000}
        />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
