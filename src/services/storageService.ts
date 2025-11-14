import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm, UserPreferences } from '../types/alarm';

const ALARMS_KEY = '@risewise_alarms';
const PREFERENCES_KEY = '@risewise_preferences';
const SNOOZE_HISTORY_KEY = '@risewise_snooze_history';

export const storageService = {
  // Alarm operations
  async getAlarms(): Promise<Alarm[]> {
    try {
      const data = await AsyncStorage.getItem(ALARMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading alarms:', error);
      return [];
    }
  },

  async saveAlarm(alarm: Alarm): Promise<void> {
    try {
      const alarms = await this.getAlarms();
      const existingIndex = alarms.findIndex((a) => a.id === alarm.id);
      if (existingIndex >= 0) {
        alarms[existingIndex] = alarm;
      } else {
        alarms.push(alarm);
      }
      await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
    } catch (error) {
      console.error('Error saving alarm:', error);
    }
  },

  async deleteAlarm(alarmId: string): Promise<void> {
    try {
      const alarms = await this.getAlarms();
      const filtered = alarms.filter((a) => a.id !== alarmId);
      await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting alarm:', error);
    }
  },

  async updateAlarmStatus(alarmId: string, isActive: boolean): Promise<void> {
    try {
      const alarms = await this.getAlarms();
      const alarm = alarms.find((a) => a.id === alarmId);
      if (alarm) {
        alarm.isActive = isActive;
        await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
      }
    } catch (error) {
      console.error('Error updating alarm status:', error);
    }
  },

  // Preferences operations
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      return data
        ? JSON.parse(data)
        : {
            theme: 'auto',
            clockStyle: 'digital',
            snoozeDuration: 5,
            enableAdaptiveWake: true,
            enableMotivationalQuotes: true,
            enableWeatherDisplay: true,
          };
    } catch (error) {
      console.error('Error reading preferences:', error);
      return {
        theme: 'auto',
        clockStyle: 'digital',
        snoozeDuration: 5,
        enableAdaptiveWake: true,
        enableMotivationalQuotes: true,
        enableWeatherDisplay: true,
      };
    }
  },

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  // Snooze history operations
  async recordSnooze(alarmId: string, snoozedFor: number): Promise<void> {
    try {
      const history = await AsyncStorage.getItem(SNOOZE_HISTORY_KEY);
      const snoozeHistory = history ? JSON.parse(history) : [];
      snoozeHistory.push({
        alarmId,
        timestamp: new Date().toISOString(),
        snoozedFor,
      });
      await AsyncStorage.setItem(SNOOZE_HISTORY_KEY, JSON.stringify(snoozeHistory));
    } catch (error) {
      console.error('Error recording snooze:', error);
    }
  },

  async getSnoozeHistory(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(SNOOZE_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading snooze history:', error);
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ALARMS_KEY, PREFERENCES_KEY, SNOOZE_HISTORY_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
