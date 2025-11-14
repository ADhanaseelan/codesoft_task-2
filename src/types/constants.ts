import { Alarm, AlarmTone, MotivationalQuote } from './alarm';

export const ALARM_TONES: AlarmTone[] = [
  {
    id: '1',
    name: 'Classic Bell',
    category: 'system',
    duration: 30,
  },
  {
    id: '2',
    name: 'Gentle Waves',
    category: 'nature',
    duration: 45,
  },
  {
    id: '3',
    name: 'Piano Dreams',
    category: 'music',
    duration: 40,
  },
  {
    id: '4',
    name: 'Bird Song',
    category: 'nature',
    duration: 35,
  },
  {
    id: '5',
    name: 'Digital Beep',
    category: 'system',
    duration: 25,
  },
];

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: '1',
    text: 'Rise and shine! Today is full of endless possibilities.',
    author: 'Unknown',
    category: 'morning',
  },
  {
    id: '2',
    text: 'Every morning brings new hope. Make it count!',
    author: 'Unknown',
    category: 'motivation',
  },
  {
    id: '3',
    text: 'You are capable of amazing things. Start your day with purpose.',
    author: 'Unknown',
    category: 'motivation',
  },
  {
    id: '4',
    text: 'The early bird catches the worm. Seize the day!',
    author: 'Proverb',
    category: 'morning',
  },
  {
    id: '5',
    text: 'Your potential is limitless. Make today extraordinary.',
    author: 'Unknown',
    category: 'motivation',
  },
  {
    id: '6',
    text: 'Breathe. You\'ve got this. Today is your day.',
    author: 'Unknown',
    category: 'mindfulness',
  },
  {
    id: '7',
    text: 'Wake up with determination. Go to bed with satisfaction.',
    author: 'Unknown',
    category: 'motivation',
  },
  {
    id: '8',
    text: 'This is your moment. Make it matter.',
    author: 'Unknown',
    category: 'morning',
  },
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const REPEAT_OPTIONS = [
  { label: 'Once', value: [] },
  { label: 'Daily', value: DAYS_OF_WEEK },
  { label: 'Weekdays', value: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { label: 'Weekends', value: ['Saturday', 'Sunday'] },
  { label: 'Custom', value: 'custom' },
];
