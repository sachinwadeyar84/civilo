/**
 * Civilo — App entry
 * Sets up navigation: Auth stack → Main tabs (Home, Search, Bookings, Profile)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import ServiceListScreen from './src/screens/ServiceListScreen';
import VendorProfileScreen from './src/screens/VendorProfileScreen';
import BookingScreen from './src/screens/BookingScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ServiceList" component={ServiceListScreen} options={{ title: '' }} />
        <Stack.Screen name="VendorProfile" component={VendorProfileScreen} options={{ title: '' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Service' }} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: 'Order Status' }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Rate & Review' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
