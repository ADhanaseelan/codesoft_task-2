import * as Notifications from 'expo-notifications';
import { Alarm } from '../types/alarm';
import { storageService } from './storageService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async scheduleAlarmNotification(alarm: Alarm): Promise<string | null> {
    try {
      const now = new Date();
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const alarmDate = new Date();
      alarmDate.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Rise and Shine! ☀️',
          body: alarm.label || 'Wake up!',
          sound: 'default',
          data: {
            alarmId: alarm.id,
            label: alarm.label,
            tone: alarm.tone.id,
          },
        },
        trigger: {
          date: alarmDate,
        },
      });

      console.log('Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async scheduleRecurringAlarmNotification(alarm: Alarm): Promise<string | null> {
    try {
      // For repeating alarms, we'll schedule multiple notifications
      if (alarm.repeatDays.length === 0) {
        return this.scheduleAlarmNotification(alarm);
      }

      const [hours, minutes] = alarm.time.split(':').map(Number);
      const notificationIds: string[] = [];

      // Schedule for each repeat day for the next 4 weeks
      for (let week = 0; week < 4; week++) {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
          
          if (alarm.repeatDays.includes(dayName as any)) {
            const triggerDate = new Date();
            const daysUntil = (dayIndex - triggerDate.getDay() + 7) % 7 || 7;
            triggerDate.setDate(triggerDate.getDate() + daysUntil + week * 7);
            triggerDate.setHours(hours, minutes, 0, 0);

            if (triggerDate > new Date()) {
              const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Rise and Shine! ☀️',
                  body: alarm.label || 'Wake up!',
                  sound: 'default',
                  data: {
                    alarmId: alarm.id,
                    label: alarm.label,
                    tone: alarm.tone.id,
                  },
                },
                trigger: {
                  date: triggerDate,
                },
              });
              notificationIds.push(notificationId);
            }
          }
        }
      }

      return notificationIds[0] || null;
    } catch (error) {
      console.error('Error scheduling recurring notification:', error);
      return null;
    }
  },

  async cancelAlarmNotifications(alarmId: string): Promise<void> {
    try {
      const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const alarmNotifications = allNotifications.filter(
        (notif: any) => notif.content.data?.alarmId === alarmId
      );

      for (const notif of alarmNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  },

  async sendTestNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Alarm',
          body: 'This is a test notification',
          sound: 'default',
        },
        trigger: {
          seconds: 2,
        },
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  },
};
