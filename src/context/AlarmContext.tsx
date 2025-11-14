import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alarm, UserPreferences, MotivationalQuote } from '../types/alarm';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { MOTIVATIONAL_QUOTES } from '../types/constants';

interface AlarmContextType {
  alarms: Alarm[];
  preferences: UserPreferences;
  currentQuote: MotivationalQuote;
  isRinging: boolean;
  ringingAlarmId: string | null;
  
  // Alarm actions
  addAlarm: (alarm: Alarm) => Promise<void>;
  updateAlarm: (alarm: Alarm) => Promise<void>;
  deleteAlarm: (alarmId: string) => Promise<void>;
  toggleAlarmStatus: (alarmId: string, isActive: boolean) => Promise<void>;
  
  // Preference actions
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  
  // Alarm ringing
  triggerAlarm: (alarmId: string) => void;
  snoozeAlarm: (alarmId: string, minutes: number) => void;
  dismissAlarm: () => void;
  
  // Quote actions
  getRandomQuote: () => MotivationalQuote;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    clockStyle: 'digital',
    snoozeDuration: 5,
    enableAdaptiveWake: true,
    enableMotivationalQuotes: true,
    enableWeatherDisplay: true,
  });
  const [isRinging, setIsRinging] = useState(false);
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(MOTIVATIONAL_QUOTES[0]);

  // Initialize data from storage
  useEffect(() => {
    const initializeData = async () => {
      const savedAlarms = await storageService.getAlarms();
      const savedPreferences = await storageService.getPreferences();
      
      setAlarms(savedAlarms);
      setPreferences(savedPreferences);
      setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    };

    initializeData();
  }, []);

  const addAlarm = async (alarm: Alarm) => {
    try {
      await storageService.saveAlarm(alarm);
      setAlarms((prev) => [...prev, alarm]);
      
      if (alarm.isActive) {
        await notificationService.scheduleRecurringAlarmNotification(alarm);
      }
    } catch (error) {
      console.error('Error adding alarm:', error);
    }
  };

  const updateAlarm = async (alarm: Alarm) => {
    try {
      await storageService.saveAlarm(alarm);
      setAlarms((prev) => prev.map((a) => (a.id === alarm.id ? alarm : a)));
      
      // Reschedule notification if status changed
      if (alarm.isActive) {
        await notificationService.scheduleRecurringAlarmNotification(alarm);
      } else {
        await notificationService.cancelAlarmNotifications(alarm.id);
      }
    } catch (error) {
      console.error('Error updating alarm:', error);
    }
  };

  const deleteAlarm = async (alarmId: string) => {
    try {
      await storageService.deleteAlarm(alarmId);
      await notificationService.cancelAlarmNotifications(alarmId);
      setAlarms((prev) => prev.filter((a) => a.id !== alarmId));
    } catch (error) {
      console.error('Error deleting alarm:', error);
    }
  };

  const toggleAlarmStatus = async (alarmId: string, isActive: boolean) => {
    try {
      await storageService.updateAlarmStatus(alarmId, isActive);
      
      const updatedAlarms = alarms.map((a) =>
        a.id === alarmId ? { ...a, isActive } : a
      );
      setAlarms(updatedAlarms);

      const alarm = updatedAlarms.find((a) => a.id === alarmId);
      if (alarm) {
        if (isActive) {
          await notificationService.scheduleRecurringAlarmNotification(alarm);
        } else {
          await notificationService.cancelAlarmNotifications(alarmId);
        }
      }
    } catch (error) {
      console.error('Error toggling alarm status:', error);
    }
  };

  const updatePreferences = async (newPreferences: UserPreferences) => {
    try {
      await storageService.savePreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const triggerAlarm = (alarmId: string) => {
    setIsRinging(true);
    setRingingAlarmId(alarmId);
  };

  const snoozeAlarm = async (alarmId: string, minutes: number) => {
    try {
      await storageService.recordSnooze(alarmId, minutes);
      dismissAlarm();
      // Schedule next alarm in X minutes
      console.log(`Alarm snoozed for ${minutes} minutes`);
    } catch (error) {
      console.error('Error snoozing alarm:', error);
    }
  };

  const dismissAlarm = () => {
    setIsRinging(false);
    setRingingAlarmId(null);
    setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  };

  const getRandomQuote = () => {
    const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setCurrentQuote(quote);
    return quote;
  };

  const value: AlarmContextType = {
    alarms,
    preferences,
    currentQuote,
    isRinging,
    ringingAlarmId,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarmStatus,
    updatePreferences,
    triggerAlarm,
    snoozeAlarm,
    dismissAlarm,
    getRandomQuote,
  };

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
};

export const useAlarmContext = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarmContext must be used within an AlarmProvider');
  }
  return context;
};
