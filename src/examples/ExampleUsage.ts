// Example file showing how to use RiseWise components and hooks
// This is for reference and testing purposes

import { useAlarmContext } from '../context/AlarmContext';
import { useCurrentTime, useCountdownTimer, useTheme } from '../hooks/useAlarms';
import { timeUtils, alarmUtils, mathUtils } from '../utils/helpers';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { Alarm, AlarmTone, DayOfWeek } from '../types/alarm';
import { ALARM_TONES, REPEAT_OPTIONS } from '../types/constants';

/**
 * Example 1: Create and save an alarm
 */
export async function exampleCreateAlarm() {
  const newAlarm: Alarm = {
    id: alarmUtils.generateAlarmId(),
    time: '07:00',
    label: 'Morning Workout',
    isActive: true,
    repeatDays: ['Monday', 'Wednesday', 'Friday'] as DayOfWeek[],
    tone: ALARM_TONES[0],
    vibrationEnabled: true,
    createdAt: new Date().toISOString(),
  };

  const { addAlarm } = useAlarmContext();
  await addAlarm(newAlarm);
  console.log('Alarm created:', newAlarm);
}

/**
 * Example 2: Update an alarm
 */
export async function exampleUpdateAlarm(alarmId: string) {
  const { alarms, updateAlarm } = useAlarmContext();
  const alarm = alarms.find((a) => a.id === alarmId);

  if (alarm) {
    const updated: Alarm = {
      ...alarm,
      time: '06:30',
      label: 'Updated Workout',
      repeatDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[],
    };
    await updateAlarm(updated);
    console.log('Alarm updated:', updated);
  }
}

/**
 * Example 3: Toggle alarm status
 */
export async function exampleToggleAlarm(alarmId: string) {
  const { alarms, toggleAlarmStatus } = useAlarmContext();
  const alarm = alarms.find((a) => a.id === alarmId);

  if (alarm) {
    await toggleAlarmStatus(alarmId, !alarm.isActive);
    console.log(`Alarm ${alarmId} toggled to ${!alarm.isActive}`);
  }
}

/**
 * Example 4: Get next alarm
 */
export function exampleGetNextAlarm() {
  const { alarms } = useAlarmContext();
  const nextAlarm = timeUtils.getNextAlarmTime(alarms);
  console.log('Next alarm:', nextAlarm);
  return nextAlarm;
}

/**
 * Example 5: Calculate time until alarm
 */
export function exampleCalculateCountdown() {
  const targetTime = '07:00';
  const countdown = timeUtils.getTimeUntilAlarm(targetTime);
  console.log(`Time until alarm: ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`);
  return countdown;
}

/**
 * Example 6: Use current time in component
 */
export function exampleUseCurrentTime() {
  const { time, hours, minutes, seconds, formattedTime, formattedTimeAmPm, date } =
    useCurrentTime();

  console.log('Current time:', formattedTime); // "07:30"
  console.log('Current time (AM/PM):', formattedTimeAmPm); // "7:30 AM"
  console.log('Current date:', date); // "Monday, January 1, 2024"

  return { time, hours, minutes, seconds, formattedTime };
}

/**
 * Example 7: Generate math challenge for dismissal
 */
export function exampleMathChallenge() {
  const challenge = mathUtils.generateSimpleMathProblem();
  console.log('Math problem:', challenge.problem); // "5 + 12 = ?"
  console.log('Answer:', challenge.answer); // 17
  return challenge;
}

/**
 * Example 8: Use custom time countdown hook
 */
export function exampleCountdownTimer() {
  const targetTime = '07:30';
  const countdown = useCountdownTimer(targetTime);
  // Returns { hours: 0, minutes: 15, seconds: 30 }
  console.log('Countdown:', countdown);
  return countdown;
}

/**
 * Example 9: Use theme hook for styling
 */
export function exampleUseTheme() {
  const { isDark, colors } = useTheme();

  console.log('Dark mode:', isDark);
  console.log('Primary color:', colors.primary); // #FF6B6B
  console.log('Background:', colors.background);

  return { isDark, colors };
}

/**
 * Example 10: Format time values
 */
export function exampleTimeFormatting() {
  const time24h = timeUtils.formatTime(14, 30); // "14:30"
  const time12h = timeUtils.formatTimeAmPm(14, 30); // "2:30 PM"
  const time12hMorning = timeUtils.formatTimeAmPm(7, 0); // "7:00 AM"

  console.log('24-hour format:', time24h);
  console.log('12-hour format:', time12h);

  return { time24h, time12h, time12hMorning };
}

/**
 * Example 11: Get day of week
 */
export function exampleGetDayOfWeek() {
  const date = new Date();
  const dayName = timeUtils.getDayOfWeek(date);
  console.log('Today is:', dayName); // "Monday"
  return dayName;
}

/**
 * Example 12: Check if alarm is due today
 */
export function exampleIsAlarmDueToday() {
  const { alarms } = useAlarmContext();
  const alarm = alarms[0];

  if (alarm) {
    const isDue = timeUtils.isAlarmDueToday(alarm);
    console.log('Alarm due today:', isDue);
    return isDue;
  }
}

/**
 * Example 13: Sort alarms by time
 */
export function exampleSortAlarms() {
  const { alarms } = useAlarmContext();
  const sortedAlarms = alarmUtils.sortAlarmsByTime(alarms);
  console.log('Sorted alarms:', sortedAlarms);
  return sortedAlarms;
}

/**
 * Example 14: Count active alarms
 */
export function exampleCountActiveAlarms() {
  const { alarms } = useAlarmContext();
  const activeCount = alarmUtils.getActiveAlarmsCount(alarms);
  console.log('Active alarms:', activeCount);
  return activeCount;
}

/**
 * Example 15: Generate unique alarm ID
 */
export function exampleGenerateAlarmId() {
  const id = alarmUtils.generateAlarmId();
  console.log('Generated ID:', id); // "alarm_1234567890123_abc123def456"
  return id;
}

/**
 * Example 16: Save to local storage
 */
export async function exampleSaveToStorage() {
  const alarm: Alarm = {
    id: alarmUtils.generateAlarmId(),
    time: '08:00',
    label: 'Test Alarm',
    isActive: true,
    repeatDays: [] as DayOfWeek[],
    tone: ALARM_TONES[0],
    vibrationEnabled: true,
    createdAt: new Date().toISOString(),
  };

  await storageService.saveAlarm(alarm);
  console.log('Alarm saved to storage');
}

/**
 * Example 17: Read from local storage
 */
export async function exampleReadFromStorage() {
  const alarms = await storageService.getAlarms();
  console.log('Retrieved alarms:', alarms);
  return alarms;
}

/**
 * Example 18: Get user preferences
 */
export async function exampleGetPreferences() {
  const prefs = await storageService.getPreferences();
  console.log('User preferences:', prefs);
  return prefs;
}

/**
 * Example 19: Snooze an alarm
 */
export async function exampleSnoozeAlarm(alarmId: string) {
  const { snoozeAlarm } = useAlarmContext();
  await snoozeAlarm(alarmId, 10); // Snooze for 10 minutes
  console.log('Alarm snoozed for 10 minutes');
}

/**
 * Example 20: Dismiss alarm and get quote
 */
export async function exampleDismissAlarm() {
  const { dismissAlarm, currentQuote } = useAlarmContext();
  dismissAlarm();
  console.log('Alarm dismissed');
  console.log('Quote:', currentQuote.text);
}

/**
 * Example 21: Test notification
 */
export async function exampleTestNotification() {
  await notificationService.sendTestNotification();
  console.log('Test notification scheduled');
}

/**
 * Example 22: Schedule recurring alarm notification
 */
export async function exampleScheduleRecurringAlarm() {
  const { alarms } = useAlarmContext();
  const alarm = alarms[0];

  if (alarm && alarm.isActive) {
    await notificationService.scheduleRecurringAlarmNotification(alarm);
    console.log('Recurring alarm scheduled');
  }
}

/**
 * Example 23: Cancel alarm notifications
 */
export async function exampleCancelNotifications(alarmId: string) {
  await notificationService.cancelAlarmNotifications(alarmId);
  console.log('Notifications canceled for:', alarmId);
}

/**
 * Example 24: Record snooze in history
 */
export async function exampleRecordSnooze(alarmId: string) {
  await storageService.recordSnooze(alarmId, 10);
  console.log('Snooze recorded: 10 minutes');
}

/**
 * Example 25: Get snooze history
 */
export async function exampleGetSnoozeHistory() {
  const history = await storageService.getSnoozeHistory();
  console.log('Snooze history:', history);
  return history;
}

/**
 * USAGE IN COMPONENTS:
 *
 * 1. Import needed utilities:
 *    import { useAlarmContext } from '../context/AlarmContext';
 *    import { useCurrentTime } from '../hooks/useAlarms';
 *    import { timeUtils } from '../utils/helpers';
 *
 * 2. Use in component:
 *    const MyComponent = () => {
 *      const { alarms, addAlarm } = useAlarmContext();
 *      const { hours, minutes } = useCurrentTime();
 *      const nextAlarm = timeUtils.getNextAlarmTime(alarms);
 *      return <Text>{nextAlarm?.time}</Text>;
 *    };
 *
 * 3. Handle async operations:
 *    const handleCreateAlarm = async () => {
 *      try {
 *        await addAlarm(newAlarm);
 *        alert('Alarm created!');
 *      } catch (error) {
 *        alert('Error creating alarm');
 *      }
 *    };
 */
