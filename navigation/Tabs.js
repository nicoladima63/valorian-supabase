import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';
import Calendar from '../screens/Calendario';
import Account from '../screens/Account';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    // Access session from current tab's params
    const navigation = useNavigation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'ios-person' : 'ios-person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#d42fc2',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { backgroundColor: '#181d23', height: 55, borderTopColor: '#2b3038' },
            })}
        >
            <Tab.Screen
                name="Main"
                component={HomePage}
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="home" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />
            <Tab.Screen
                name="Calendario"
                component={Calendar}
                options={{
                    tabBarLabel: 'Calendario',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="calendar" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    tabBarLabel: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="user" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />

            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarLabel: 'Settings',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="cog" color={color} />,
                    tabBarLabelStyle: { marginBottom: 8 }
                }}
            />
        </Tab.Navigator>
    );
};
