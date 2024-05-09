import { View, Text,StatusBar } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/home';
import Detail from './screens/detail';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import BlurView from 'react-native-blur-effect';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const Stack = createSharedElementStackNavigator();
const App = () => {
  return (
    <GestureHandlerRootView style={{flex:1,backgroundColor:"black"}}>
    <NavigationContainer >

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={Detail} sharedElements={()=>{
            return [{
              id:"1",
              animation:"move",
              
            }]
          }}  options={{animation:"default" ,cardStyleInterpolator:CardStyleInterpolators.forRevealFromBottomAndroid}} />
        </Stack.Navigator>
        <View style={{ position: "absolute", top: 0, right: 0, left: 0, height: StatusBar.currentHeight, zIndex: 5 }}>
      <BlurView
        blurRadius={2}
        style={{ flex: 1 }}>

      </BlurView>
    </View>
      </NavigationContainer>
      
      </GestureHandlerRootView>
   
  )
}

export default App