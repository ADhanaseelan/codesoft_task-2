import { Alarm } from '../types/alarm';

export const timeUtils = {
  formatTime(hours: number, minutes: number): string {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m}`;
  },

  formatTimeAmPm(hours: number, minutes: number): string {
    const h = hours % 12 || 12;
    const m = String(minutes).padStart(2, '0');
    const am = hours < 12 ? 'AM' : 'PM';
    return `${h}:${m} ${am}`;
  },

  parseTime(timeString: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  },

  getNextAlarmTime(alarms: Alarm[]): Alarm | null {
    const activeAlarms = alarms.filter((a) => a.isActive);
    if (activeAlarms.length === 0) return null;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Sort by time
    const sorted = [...activeAlarms].sort((a, b) => a.time.localeCompare(b.time));

    // Find next alarm today
    const nextToday = sorted.find((a) => a.time > currentTime);
    if (nextToday) return nextToday;

    // Return first alarm of tomorrow
    return sorted[0] || null;
  },

  getTimeUntilAlarm(alarmTime: string): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const [alarmHours, alarmMinutes] = alarmTime.split(':').map(Number);

    let alarmDate = new Date();
    alarmDate.setHours(alarmHours, alarmMinutes, 0, 0);

    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    const diff = alarmDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  },

  getDayOfWeek(date: Date): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  },

  isAlarmDueToday(alarm: Alarm): boolean {
    const today = this.getDayOfWeek(new Date());
    return alarm.repeatDays.includes(today as any) || alarm.repeatDays.length === 0;
  },

  getCurrentDateFormatted(): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  },
};

export const alarmUtils = {
  generateAlarmId(): string {
    return `alarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  isAlarmDuplicate(alarms: Alarm[], newAlarm: Alarm): boolean {
    return alarms.some(
      (a) =>
        a.time === newAlarm.time &&
        JSON.stringify(a.repeatDays.sort()) === JSON.stringify(newAlarm.repeatDays.sort()) &&
        a.id !== newAlarm.id
    );
  },

  sortAlarmsByTime(alarms: Alarm[]): Alarm[] {
    return [...alarms].sort((a, b) => a.time.localeCompare(b.time));
  },

  getActiveAlarmsCount(alarms: Alarm[]): number {
    return alarms.filter((a) => a.isActive).length;
  },
};

export const mathUtils = {
  generateSimpleMathProblem(): { problem: string; answer: number } {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';

    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    const problem = `${num1} ${operation} ${num2} = ?`;

    return { problem, answer };
  },
};

export const stringUtils = {
  truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length - 3) + '...';
  },

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
};
