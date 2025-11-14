// Alarm interface
export interface Alarm {
  id: string;
  time: string; // HH:mm format
  label: string;
  isActive: boolean;
  repeatDays: DayOfWeek[];
  tone: AlarmTone;
  vibrationEnabled: boolean;
  createdAt: string;
  isRinging?: boolean;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface AlarmTone {
  id: string;
  name: string;
  category: 'system' | 'custom' | 'nature' | 'music';
  filePath?: string;
  duration: number; // in seconds
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: 'morning' | 'motivation' | 'mindfulness';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  clockStyle: 'digital' | 'analog' | 'minimalist';
  snoozeDuration: number; // in minutes
  enableAdaptiveWake: boolean;
  enableMotivationalQuotes: boolean;
  enableWeatherDisplay: boolean;
}

export interface SnoozeHistory {
  alarmId: string;
  timestamp: string;
  snoozedFor: number; // in minutes
}
