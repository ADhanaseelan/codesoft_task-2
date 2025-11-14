import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/useAlarms';
import { useAlarmContext } from '../context/AlarmContext';
import { Button, ToggleSwitch } from '../components/Common';
import { ALARM_TONES, REPEAT_OPTIONS, DAYS_OF_WEEK } from '../types/constants';
import { alarmUtils, timeUtils } from '../utils/helpers';
import { Alarm, DayOfWeek, AlarmTone } from '../types/alarm';

interface AlarmCreationScreenProps {
  navigation: any;
  route?: any;
}

export const AlarmCreationScreen: React.FC<AlarmCreationScreenProps> = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const { isDark, colors } = useTheme();
  const { addAlarm, updateAlarm } = useAlarmContext();

  const existingAlarm = route?.params?.alarm;

  // Form state
  const [time, setTime] = useState(existingAlarm?.time || '07:00');
  const [label, setLabel] = useState(existingAlarm?.label || '');
  const [selectedTone, setSelectedTone] = useState<AlarmTone>(
    ALARM_TONES.find((t) => t.id === existingAlarm?.tone.id) || ALARM_TONES[0]
  );
  const [vibrationEnabled, setVibrationEnabled] = useState(existingAlarm?.vibrationEnabled ?? true);
  const [repeatDays, setRepeatDays] = useState<DayOfWeek[]>(existingAlarm?.repeatDays || []);
  const [isActive, setIsActive] = useState(existingAlarm?.isActive ?? true);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showToneSelector, setShowToneSelector] = useState(false);

  const isDarkMode = isDark || (colorScheme === 'dark');
  const currentColors = isDarkMode ? colors : colors;

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    setTime(timeUtils.formatTime(newHours, newMinutes));
    setShowTimeModal(false);
  };

  const toggleRepeatDay = (day: DayOfWeek) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSelectRepeatOption = (option: any) => {
    if (option.value === 'custom') {
      // Keep current selection
      return;
    }
    setRepeatDays(option.value);
  };

  const handleSaveAlarm = async () => {
    if (!time) {
      alert('Please select a time');
      return;
    }

    const alarm: Alarm = {
      id: existingAlarm?.id || alarmUtils.generateAlarmId(),
      time,
      label: label || 'Alarm',
      isActive,
      repeatDays,
      tone: selectedTone,
      vibrationEnabled,
      createdAt: existingAlarm?.createdAt || new Date().toISOString(),
    };

    try {
      if (existingAlarm) {
        await updateAlarm(alarm);
      } else {
        await addAlarm(alarm);
      }
      navigation.goBack();
    } catch (error) {
      alert('Error saving alarm');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerButton, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>
          {existingAlarm ? 'Edit Alarm' : 'New Alarm'}
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Time Picker Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Time</Text>
          <TouchableOpacity
            style={[styles.timeDisplay, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}
            onPress={() => setShowTimeModal(true)}
          >
            <Text style={[styles.timeText, { color: currentColors.primary }]}>
              {timeUtils.formatTimeAmPm(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))}
            </Text>
            <Text style={[styles.timeChangeHint, { color: currentColors.textSecondary }]}>
              Tap to change
            </Text>
          </TouchableOpacity>
        </View>

        {/* Simple Time Input */}
        <View style={styles.timeInputContainer}>
          <Text style={[styles.label, { color: currentColors.text }]}>Hours: Minutes</Text>
          <View style={styles.timeInputRow}>
            <TouchableOpacity
              style={[styles.timeInputButton, { backgroundColor: currentColors.surface }]}
              onPress={() => {
                const [h, m] = time.split(':').map(Number);
                handleTimeChange((h + 1) % 24, m);
              }}
            >
              <Text style={[styles.timeInputButtonText, { color: currentColors.primary }]}>+</Text>
            </TouchableOpacity>
            <Text style={[styles.timeInputValue, { color: currentColors.text }]}>
              {String(parseInt(time.split(':')[0])).padStart(2, '0')}
            </Text>
            <TouchableOpacity
              style={[styles.timeInputButton, { backgroundColor: currentColors.surface }]}
              onPress={() => {
                const [h, m] = time.split(':').map(Number);
                handleTimeChange((h - 1 + 24) % 24, m);
              }}
            >
              <Text style={[styles.timeInputButtonText, { color: currentColors.primary }]}>−</Text>
            </TouchableOpacity>

            <Text style={[styles.timeInputValue, { color: currentColors.text }]}>:</Text>

            <TouchableOpacity
              style={[styles.timeInputButton, { backgroundColor: currentColors.surface }]}
              onPress={() => {
                const [h, m] = time.split(':').map(Number);
                handleTimeChange(h, (m + 1) % 60);
              }}
            >
              <Text style={[styles.timeInputButtonText, { color: currentColors.primary }]}>+</Text>
            </TouchableOpacity>
            <Text style={[styles.timeInputValue, { color: currentColors.text }]}>
              {String(parseInt(time.split(':')[1])).padStart(2, '0')}
            </Text>
            <TouchableOpacity
              style={[styles.timeInputButton, { backgroundColor: currentColors.surface }]}
              onPress={() => {
                const [h, m] = time.split(':').map(Number);
                handleTimeChange(h, (m - 1 + 60) % 60);
              }}
            >
              <Text style={[styles.timeInputButtonText, { color: currentColors.primary }]}>−</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Label Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Label (Optional)</Text>
          <View
            style={[
              styles.input,
              {
                backgroundColor: currentColors.surface,
                borderColor: currentColors.border,
              },
            ]}
          >
            <Text style={[styles.inputText, { color: currentColors.text }]}>
              {label || 'Enter label (e.g., "Gym Time", "Work")'}
            </Text>
          </View>
        </View>

        {/* Repeat Days Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Repeat</Text>

          <View style={styles.repeatOptionsContainer}>
            {REPEAT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.repeatOption,
                  {
                    backgroundColor:
                      (option.value === 'custom' && repeatDays.length > 0 && repeatDays.length < 7) ||
                      JSON.stringify(option.value) === JSON.stringify(repeatDays)
                        ? currentColors.primary
                        : currentColors.surface,
                    borderColor: currentColors.border,
                  },
                ]}
                onPress={() => handleSelectRepeatOption(option)}
              >
                <Text
                  style={[
                    styles.repeatOptionText,
                    {
                      color:
                        (option.value === 'custom' && repeatDays.length > 0 && repeatDays.length < 7) ||
                        JSON.stringify(option.value) === JSON.stringify(repeatDays)
                          ? '#ffffff'
                          : currentColors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {repeatDays.length > 0 && repeatDays.length < 7 && (
            <View style={styles.customDaysContainer}>
              <Text style={[styles.customDaysLabel, { color: currentColors.textSecondary }]}>
                Custom Days:
              </Text>
              <View style={styles.daysGrid}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      {
                        backgroundColor: repeatDays.includes(day as DayOfWeek)
                          ? currentColors.primary
                          : currentColors.surface,
                        borderColor: currentColors.border,
                      },
                    ]}
                    onPress={() => toggleRepeatDay(day as DayOfWeek)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        {
                          color: repeatDays.includes(day as DayOfWeek)
                            ? '#ffffff'
                            : currentColors.text,
                        },
                      ]}
                    >
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Tone Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Alarm Tone</Text>
          <TouchableOpacity
            style={[styles.toneSelector, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}
            onPress={() => setShowToneSelector(!showToneSelector)}
          >
            <View>
              <Text style={[styles.toneSelectorLabel, { color: currentColors.textSecondary }]}>
                Current Tone:
              </Text>
              <Text style={[styles.toneSelectorValue, { color: currentColors.text }]}>
                {selectedTone.name}
              </Text>
            </View>
            <Text style={{ fontSize: 18 }}>{showToneSelector ? '▼' : '▶'}</Text>
          </TouchableOpacity>

          {showToneSelector && (
            <View style={styles.toneSelectorList}>
              {ALARM_TONES.map((tone) => (
                <TouchableOpacity
                  key={tone.id}
                  style={[
                    styles.toneOption,
                    {
                      backgroundColor: selectedTone.id === tone.id ? currentColors.primary : 'transparent',
                      borderColor: currentColors.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedTone(tone);
                    setShowToneSelector(false);
                  }}
                >
                  <Text
                    style={[
                      styles.toneOptionText,
                      {
                        color: selectedTone.id === tone.id ? '#ffffff' : currentColors.text,
                      },
                    ]}
                  >
                    {tone.name}
                  </Text>
                  <Text style={[styles.toneCategory, { color: selectedTone.id === tone.id ? '#ffffff' : currentColors.textSecondary }]}>
                    {tone.category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Vibration Toggle */}
        <View style={styles.section}>
          <View
            style={[
              styles.toggleContainer,
              { backgroundColor: currentColors.surface, borderColor: currentColors.border },
            ]}
          >
            <Text style={[styles.toggleLabel, { color: currentColors.text }]}>Enable Vibration</Text>
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                {
                  backgroundColor: vibrationEnabled ? '#51cf66' : currentColors.border,
                },
              ]}
              onPress={() => setVibrationEnabled(!vibrationEnabled)}
            >
              <View
                style={[
                  styles.switchThumb,
                  {
                    alignSelf: vibrationEnabled ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={existingAlarm ? 'Update Alarm' : 'Create Alarm'}
            onPress={handleSaveAlarm}
            variant="primary"
            size="large"
          />
          <Button title="Cancel" onPress={() => navigation.goBack()} variant="secondary" size="large" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeDisplay: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeChangeHint: {
    fontSize: 12,
  },
  timeInputContainer: {
    marginBottom: 24,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timeInputButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInputButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeInputValue: {
    fontSize: 28,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
  },
  repeatOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  repeatOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  repeatOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customDaysContainer: {
    marginTop: 12,
  },
  customDaysLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  toneSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  toneSelectorLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  toneSelectorValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  toneSelectorList: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toneOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  toneOptionText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  toneCategory: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
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
  buttonContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
});
