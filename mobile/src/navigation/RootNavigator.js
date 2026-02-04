import React, { useContext } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthContext } from './context/AuthContext';
import LoginScreen from './screens/auth/LoginScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import GoatInventoryScreen from './screens/goats/GoatInventoryScreen';
import GoatDetailScreen from './screens/goats/GoatDetailScreen';
import CreateGoatScreen from './screens/goats/CreateGoatScreen';
import ChickenManagementScreen from './screens/chickens/ChickenManagementScreen';
import ExpensesScreen from './screens/expenses/ExpensesScreen';
import ActivityLogScreen from './screens/activity/ActivityLogScreen';
import ReportsScreen from './screens/reports/ReportsScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const GoatStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#8B7355' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="GoatInventory"
      component={GoatInventoryScreen}
      options={{ title: 'Goat Inventory' }}
    />
    <Stack.Screen
      name="GoatDetail"
      component={GoatDetailScreen}
      options={{ title: 'Goat Details' }}
    />
    <Stack.Screen
      name="CreateGoat"
      component={CreateGoatScreen}
      options={{ title: 'Add Goat' }}
    />
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#8B7355' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'DashboardTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'GoatsTab') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'ChickensTab') {
          iconName = focused ? 'egg' : 'egg-outline';
        } else if (route.name === 'ExpensesTab') {
          iconName = focused ? 'wallet' : 'wallet-outline';
        } else if (route.name === 'ActivityTab') {
          iconName = focused ? 'clipboard' : 'clipboard-outline';
        } else if (route.name === 'ReportsTab') {
          iconName = focused ? 'bar-chart' : 'bar-chart-outline';
        } else if (route.name === 'SettingsTab') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#8B7355',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e0e0e0' },
    })}
  >
    <Tab.Screen
      name="DashboardTab"
      component={DashboardStack}
      options={{ title: 'Home' }}
    />
    <Tab.Screen
      name="GoatsTab"
      component={GoatStack}
      options={{ title: 'Goats' }}
    />
    <Tab.Screen
      name="ChickensTab"
      component={ChickenManagementScreen}
      options={{ title: 'Chickens' }}
    />
    <Tab.Screen
      name="ExpensesTab"
      component={ExpensesScreen}
      options={{ title: 'Expenses' }}
    />
    <Tab.Screen
      name="ActivityTab"
      component={ActivityLogScreen}
      options={{ title: 'Activity' }}
    />
    <Tab.Screen
      name="ReportsTab"
      component={ReportsScreen}
      options={{ title: 'Reports' }}
    />
    <Tab.Screen
      name="SettingsTab"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B7355" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.token == null ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainApp" component={MainTabs} />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              animationEnabled: true,
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default RootNavigator;
