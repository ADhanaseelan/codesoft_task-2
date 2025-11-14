import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { HomeScreen } from '../screens/HomeScreen';
import { AlarmCreationScreen } from '../screens/AlarmCreationScreen';
import { AlarmRingingScreen } from '../screens/AlarmRingingScreen';
import { useAlarmContext } from '../context/AlarmContext';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { triggerAlarm } = useAlarmContext();

  // Handle notification responses
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const alarmId = response.notification.request.content.data?.alarmId;
      if (alarmId) {
        triggerAlarm(alarmId);
      }
    });

    return () => subscription.remove();
  }, [triggerAlarm]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'default',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="AlarmCreation"
          component={AlarmCreationScreen}
          options={{
              animation: 'default',
            }}
        />
        <Stack.Screen
          name="AlarmRinging"
          component={AlarmRingingScreen}
          options={{
            gestureEnabled: false,
            animation: 'default',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
