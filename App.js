import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import AppGame from './AppGame';
import CenteredHeaderTitle from './CenteredHeaderTitle'; 
import HowToPlayScreen from './HowToPlayScreen';
import SettingsScreen from './SettingsScreen';

import { SettingsProvider } from './SettingsContext';
const Stack = createStackNavigator();



const App = () => (
    <SettingsProvider>
     
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerTitle: () => <CenteredHeaderTitle title="" />,
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="AppGame" 
        component={AppGame} 
        options={{ 
          headerTitle: () => <CenteredHeaderTitle title="Wordle!" />,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#333' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen} 
       
      />
      <Stack.Screen 
        name="HowToPlayScreen" 
        component={HowToPlayScreen} 
       
      />
    </Stack.Navigator>
  </NavigationContainer>
   
    </SettingsProvider>
);

export default App;
