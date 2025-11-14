import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface ClockProps {
  hours: number;
  minutes: number;
  seconds: number;
  style?: 'digital' | 'analog' | 'minimalist';
  isDark?: boolean;
}

export const DigitalClock: React.FC<ClockProps> = ({ hours, minutes, seconds, isDark = false }) => {
  const colors = isDark
    ? { bg: '#1a1a1a', text: '#ffffff', accent: '#FF6B6B' }
    : { bg: '#ffffff', text: '#000000', accent: '#FF6B6B' };

  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');

  return (
    <View style={[styles.digitalClock, { backgroundColor: colors.bg }]}>
      <Text style={[styles.timeText, { color: colors.text }]}>
        {h}:<Text style={{ color: colors.accent }}>{m}</Text>:{s}
      </Text>
    </View>
  );
};

interface MinimalistClockProps extends ClockProps {
  format?: '12h' | '24h';
}

export const MinimalistClock: React.FC<MinimalistClockProps> = ({
  hours,
  minutes,
  isDark = false,
  format = '24h',
}) => {
  const colors = isDark
    ? { bg: '#2d2d2d', text: '#ffffff', accent: '#FF6B6B' }
    : { bg: '#f5f5f5', text: '#000000', accent: '#FF6B6B' };

  let displayHours = hours;
  let ampm = '';

  if (format === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    displayHours = hours % 12 || 12;
  }

  return (
    <View style={[styles.minimalistClock, { backgroundColor: colors.bg }]}>
      <Text style={[styles.minimalistTime, { color: colors.text }]}>
        {String(displayHours).padStart(2, '0')}
        <Text style={{ color: colors.accent }}>:</Text>
        {String(minutes).padStart(2, '0')}
      </Text>
      {format === '12h' && <Text style={[styles.ampm, { color: colors.accent }]}>{ampm}</Text>}
    </View>
  );
};

interface FloatingButtonProps {
  onPress: () => void;
  icon?: string;
  label?: string;
  color?: string;
  size?: 'small' | 'large';
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon = '+',
  label,
  color = '#FF6B6B',
  size = 'large',
}) => {
  const buttonSize = size === 'large' ? 70 : 50;

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: color,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.floatingButtonText}>{icon}</Text>
    </TouchableOpacity>
  );
};

interface AlarmCardProps {
  time: string;
  label: string;
  isActive: boolean;
  repeatDays: string[];
  onToggle: (isActive: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  isDark?: boolean;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({
  time,
  label,
  isActive,
  repeatDays,
  onToggle,
  onEdit,
  onDelete,
  isDark = false,
}) => {
  const colors = isDark
    ? { bg: '#2d2d2d', text: '#ffffff', border: '#3d3d3d', secondary: '#b0b0b0' }
    : { bg: '#f5f5f5', text: '#000000', border: '#e0e0e0', secondary: '#666666' };

  const repeatText =
    repeatDays.length === 0 ? 'Once' : repeatDays.length === 7 ? 'Daily' : repeatDays.join(', ');

  return (
    <View style={[styles.alarmCard, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <View style={styles.alarmCardLeft}>
        <Text style={[styles.alarmTime, { color: colors.text }]}>{time}</Text>
        <Text style={[styles.alarmLabel, { color: colors.secondary }]}>{label || 'No Label'}</Text>
        <Text style={[styles.alarmRepeat, { color: colors.secondary }]}>
          {repeatText}
        </Text>
      </View>

      <View style={styles.alarmCardRight}>
        <TouchableOpacity
          style={[
            styles.toggleSwitch,
            {
              backgroundColor: isActive ? '#51cf66' : colors.border,
            },
          ]}
          onPress={() => onToggle(!isActive)}
        >
          <View
            style={[
              styles.switchThumb,
              {
                alignSelf: isActive ? 'flex-end' : 'flex-start',
              },
            ]}
          />
        </TouchableOpacity>

        <View style={styles.alarmActions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Text style={[styles.actionButtonText, { color: '#0066cc' }]}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  const variants = {
    primary: { bg: '#FF6B6B', text: '#ffffff' },
    secondary: { bg: '#e0e0e0', text: '#000000' },
    danger: { bg: '#FF4444', text: '#ffffff' },
  };

  const sizes = {
    small: { padding: 8, fontSize: 14 },
    medium: { padding: 12, fontSize: 16 },
    large: { padding: 16, fontSize: 18 },
  };

  const style = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#cccccc' : style.bg,
          paddingVertical: sizeStyle.padding,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: style.text,
            fontSize: sizeStyle.fontSize,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange, label }) => {
  return (
    <View style={styles.toggleContainer}>
      {label && <Text style={styles.toggleLabel}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.toggleSwitch,
          {
            backgroundColor: value ? '#51cf66' : '#cccccc',
          },
        ]}
        onPress={() => onValueChange(!value)}
      >
        <View
          style={[
            styles.switchThumb,
            {
              alignSelf: value ? 'flex-end' : 'flex-start',
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  digitalClock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    borderRadius: 20,
    marginVertical: 20,
  },
  timeText: {
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  minimalistClock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    marginVertical: 16,
  },
  minimalistTime: {
    fontSize: 56,
    fontWeight: '300',
    letterSpacing: 2,
  },
  ampm: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  alarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  alarmCardLeft: {
    flex: 1,
  },
  alarmCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alarmLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  alarmRepeat: {
    fontSize: 12,
  },
  toggleSwitch: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  alarmActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});
