import { useEffect, useState, useCallback } from 'react';
import { timeUtils } from '../utils/helpers';

export const useCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    time,
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds(),
    formattedTime: timeUtils.formatTime(time.getHours(), time.getMinutes()),
    formattedTimeAmPm: timeUtils.formatTimeAmPm(time.getHours(), time.getMinutes()),
    date: timeUtils.getCurrentDateFormatted(),
  };
};

export const useAlarmNotifications = () => {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    // This would be set up in the app root, but we can manage it here too
    const checkNotifications = async () => {
      // Implementation would go here
    };

    checkNotifications();
  }, []);

  return { notification };
};

export const useCountdownTimer = (targetTime: string) => {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = timeUtils.getTimeUntilAlarm(targetTime);
      setCountdown(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return countdown;
};

export const useShakeDetection = (onShake: () => void, threshold: number = 20) => {
  const [shakeCount, setShakeCount] = useState(0);

  const detectShake = useCallback((x: number, y: number, z: number) => {
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    if (acceleration > threshold) {
      setShakeCount((prev) => prev + 1);
      onShake();
    }
  }, [onShake, threshold]);

  return { shakeCount, setShakeCount };
};

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  return {
    isDark,
    setIsDark,
    colors: isDark
      ? {
          primary: '#FF6B6B',
          background: '#1a1a1a',
          surface: '#2d2d2d',
          text: '#ffffff',
          textSecondary: '#b0b0b0',
          border: '#3d3d3d',
          success: '#51cf66',
          warning: '#ffa94d',
        }
      : {
          primary: '#FF6B6B',
          background: '#ffffff',
          surface: '#f5f5f5',
          text: '#000000',
          textSecondary: '#666666',
          border: '#e0e0e0',
          success: '#2f9e44',
          warning: '#f76707',
        },
  };
};

export const useLocalSearch = (items: any[], searchFields: string[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(items);

  useEffect(() => {
    if (!searchQuery) {
      setResults(items);
      return;
    }

    const filtered = items.filter((item) =>
      searchFields.some((field) =>
        String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setResults(filtered);
  }, [searchQuery, items, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    results,
  };
};
